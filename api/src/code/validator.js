// TODO: convertir en una clase, validate es un metodo dentro de la clase y va a tener
// una propiedad "errors" que se limpia y vuelve a llenar cada vez que se llame a validate
import { removeItem } from "./utils.js"

const ERRORS = {
  required: 'the field is required',
  string: 'the field is not a string',
  numeric: 'the field is not a number',
  integer: 'the field is not an integer',
  boolean: 'the field is not a boolean',
  array: 'the field is not an array',
  min: 'the field value is less than allowed',
  max: 'the field value is higher than allowed',
  str_min: 'the field length is less than allowed',
  str_max: 'the field length is higher than allowed',
  in: 'the field value is not supported',
  email: 'the field value is not a valid email address',
  alpha: 'the field value is not alphabetic',
  alpha_num: 'the field value is not alpha numeric',
  not_empty: 'the field value is empty',
  not_space: 'the field value has an space character',
  invalid_type: 'the field type is not valid',
  invalid_rule: 'the rule is not valid',
}

/**
 * valida un objecto de datos segun las reglas en formato "key: 'rule1|rule2|...'"
 * @param {object} body - objeto con los datos "key: value"
 * @param {object} rules - objeto con las reglas
 * @param {object} errors - objeto opcional donde clonar los errores
 * @returns boolean - resultado de la validacion general
 */
function multiValidate(body, rules, errors = null) {
  // creo un objeto donde iran todos los errores, este sera eliminado posteriormente si no
  // se provee un objecto externo donde guardar dichos errores
  // let error_bag = errors || {}
  validator.errors = {}
  let result = true
  for (const key in rules) {
    let single_rules = rules[key]
    if (typeof single_rules === 'string')
      single_rules = single_rules.split('|')
    // si el resultado de la validacion es false, se asigna ese valor a "result"
    isRequired(body, key, single_rules, validator.errors) || (result = false)
  }
  if (errors && validator.errors) errors = { ...validator.errors }
  return validator.pass = result
}

// "required" es una regla especial que hay que verificar antes de cualquier validacion
function isRequired(body, key, rules, bag) {
  const data = body[key]
  if (rules.includes('required')) {
    // si data no esta en body etablecemos el error y termino la funcion con false
    if (data === undefined) {
      bag[key] = [ERRORS.required]
      return false
    } else
      // si data existe, elimino la "rule" del array para verificar en la siguiente funcion
      removeItem(rules, 'required')
  }
  // si el campo es no "required" y no se proporciono entonces la validacion resuelve a "true"
  if (data === undefined) return true
  // creo un array donde iran los errores, al final si el array esta vacio, lo elimino
  bag[key] = []
  const is_valid = validate(data, rules, bag[key])
  if (bag[key].length === 0) {
    bag[key] = null
    delete bag[key]
  }
  return is_valid
}

/**
 * Valida un dato en especifico segun las reglas proporcionadas
 * @param {*} data 
 * @param {Array|string} rules - array de reglas o string separados por "|"
 * @param {Array} errors - arreglo opcional donde guardar los errores
 * @returns boolean - resultado de la validacion
 */
export function validate(data, rules, errors = null) {
  if (!Array.isArray(rules) && typeof rules !== 'string')
    throw new Error('invalid rules format')

  if (typeof rules === 'string') rules = rules.split('|')
  let error_bag = errors || []
  // bail en caso exista, debe estar en la primera posicion del arreglo de reglas
  const bail = rules[0] === 'bail'
  // despues de verificar si bail esta presente, se elimina del arreglo para que no cause
  // problemas en la funcion "passRule"
  if (bail) rules.shift()
  let is_valid = true
  // si bail es true, entonces devuelvo false en la primera verificacion que se encuentre
  // caso contrario se evalua todas las verificaciones para llenar todos los errores
  for (let i = 0; i < rules.length; i++) {
    const result = passRule(data, rules[i], error_bag)
    if (!result && bail)
      return false
    else
    // si result es false en algun momento, se guarda en valor para hacer el return final
      result || (is_valid = false)
  }
  if (!errors) error_bag = null
  return is_valid
}

export const validator = {
  errors: null,
  pass: false,
  validate: multiValidate,
  single(data, rules) {
    this.errors = {}
    return this.pass = validate(data, rules, this.errors)
  }
}

function passRule(data, rule, bag) {
  // en cada caso, si el resultado es false se agrega en bag el error correspondiente
  switch (rule) {
    case 'string':
      return typeof data === 'string'
        || !bag.push(ERRORS.string)
    case 'numeric':
      return (typeof Number(data) === 'number' && !isNaN(Number(data)))
        || !bag.push(ERRORS.numeric)
    case 'numeric:strict':
      return typeof data === 'number'
        || !bag.push(ERRORS.numeric)
    case 'integer':
      return (typeof parseInt(data) === 'number' && !isNaN(parseInt(data)))
        || !bag.push(ERRORS.integer)
    case 'integer:strict':
      return data === parseInt(data)
        || !bag.push(ERRORS.integer)
    case 'boolean':
      return [true, false, 1, 0, '1', '0'].includes(data)
        || !bag.push(ERRORS.boolean)
    case 'boolean:strict':
      return typeof data === 'boolean'
        || !bag.push(ERRORS.boolean)
    case 'array':
      return Array.isArray(data)
        || !bag.push(ERRORS.array)
    case 'alpha':
      return /^[A-Za-z]+$/.test(data)
        || !bag.push(ERRORS.alpha)
    case 'alpha_num':
      return /^[A-Za-z0-9]+$/.test(data)
        || !bag.push(ERRORS.alpha_num)
    case 'not_space':
      return data.indexOf(' ') < 0
        || !bag.push(ERRORS.not_space)
    case 'not_empty':
      return not_empty(data, bag)
    case rule.startsWith('min:') && rule:
    case rule.startsWith('max:') && rule:
      return minOrMax(rule.substring(0, 3), ruleParams(rule), data, bag)
    case rule.startsWith('in:') && rule:
      return ruleParams(rule).includes(data)
        || !bag.push(ERRORS.in)
    case 'email':
      return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(data)
        || !bag.push(ERRORS.email)
    default:
      return !bag.push(ERRORS.invalid_rule)
  }
}

function not_empty(data, bag) {
  if (typeof data === 'string')
   return data !== '' || !bag.push(ERRORS.not_empty)
  else if (Array.isArray(data))
    return data.length > 0 || !bag.push(ERRORS.not_empty)
  else if (data === null || data === undefined)
    return !bag.push(ERRORS.not_empty)
  else
    return true
}

function ruleParams(rule) {
  let params = rule.substring(rule.indexOf(':') + 1)
  params = params.split(',')
  return params.length > 1 ? params : params[0]
}

// esta funcion evalua el minimo y maximo, en caso de numeros su valor y en strings su longitud
function minOrMax(rule, value, data, bag) {
  if (rule === 'min') {
    if (typeof data === 'string')
      return data.length >= value || !bag.push(ERRORS.str_min)
    else if (typeof data === 'number')
      return data >= value || !bag.push(ERRORS.min)
    else
      return !bag.push(ERRORS.invalid_type)
  }
  else {
    if (typeof data === 'string')
      return data.length <= value || !bag.push(ERRORS.str_max)
    else if (typeof data === 'number')
      return data <= value || !bag.push(ERRORS.max)
    else
      return !bag.push(ERRORS.invalid_type)
  }
}