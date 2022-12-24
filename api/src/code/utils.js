/** @typedef { import('express').Response } Response */
import bcrypt from 'bcrypt'

export async function validatePass(password, hash) {
  return await bcrypt.compare(password, hash)
}

export async function encryptPass(password) {
  return await bcrypt.hash(password, 8)
}

/** @param { Response } res */
export function jsonOk(res, data = null, status = 200, headers = null) {
  json('ok', res, data, status, headers)
}

/** @param { Response } res */
export function jsonError(res, data = null, status = 400, headers = null) {
  json('error', res, data, status, headers)
}

/** @param { Response } res */
function json(state, res, data, status, headers) {
  let response = {}

  if (typeof data === 'string')
    response.message = data
  else if (data === null)
    response.state = state
  else
    response = data
  
  if (state === 'error') response.state = 'error'
  
  if (headers) res.header(headers)
  res.status(status).json(response)
}

export function parseTime(time) {
  time = parseInt(time / 1000)
  const h = parseInt(time / 3600)
  const m = parseInt((time % 3600) / 60)
  const s = parseInt(time % 60)
  return `${ h<10?'0'+h:h }:${ m<10?'0'+m:m }:${ s<10?'0'+s:s }`
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * @param {Array} arr - arrary donde se eliminara el elemento
 * @param {*} elem - elemento a eliminar
 * @returns number - indice del elemento eliminado o -1 en caso contrario
 */
export function removeItem(arr, elem) {
  const index = arr.indexOf(elem)
  if (index >= 0)
    arr.splice(index, 1)
  return index
}

/**
 * 
 * @param {Array} arr - array donde eliminar un elemento
 * @param {*} elem - elemento a eliminar
 * @returns Array - un nuevo arreglo sin el elemento
 */
export function filterItem(arr, elem) {
  return arr.filter( (item)=> item !== elem)
}

/**
 * Helper que retorna una funcion para actualizar una propiedad de objeto del estado sin
 * modificar el resto de del estado
 * @param {*} state - Estado local del componente
 * @param {Function} setState - Funcion para actualizar el estado
 * @returns Funcion que actualiza efectivamente el estado
 */
export const stateUpdater = (state, setState)=> (prop, value)=> {
  console.log(state)
  const copy = { ...state }
  // divido en un array las props anidadas i.e: 'one.two' -> ['one', 'two']
  const props = prop.split('.')
  if (props.length > 1) {
    let pointer = copy
    // apunto solo hasta el penultimo objeto para tener una referencia y no un valor
    for (let i = 0; i < props.length - 1; i++)
      pointer = pointer[props[i]]
    // seteo la ultima referencia con el valor dado
    pointer[props[props.length - 1]] = value
  }
  // si solo hay una prop seteo el valor directamente
  else copy[prop] = value
  state = copy
  setState(copy)
}

export const sleep = (ms = 1000)=> new Promise((resolve)=> setTimeout(resolve, ms))

export const mergeObj = (base, extend)=> {
  const merged = {}
  for (const key in base)
    merged[key] = extend[key] ?? base[key]
  return merged
}

/** retorna el tipo del objeto en minusculas */
export const typeOf = (obj)=> Object.prototype.toString.call(obj).split(' ')[1].slice(0, -1).toLowerCase()