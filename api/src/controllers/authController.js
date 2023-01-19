/** @typedef { import('express').Request } Request */
/** @typedef { import('express').Response } Response */

import { Op } from 'sequelize';
import { encryptPass, jsonError, jsonOk } from '../code/utils.js';
import { validator } from '../code/validator.js'
import User from '../models/User.js'

export function check(req, res) {
  jsonOk(res, {
    authenticated: req.isAuthenticated(),
    user: req.isAuthenticated() ? { id: req.user.id, names: req.user.names, username: req.user.username } : null
  })
}

export function login(_, res) { jsonOk(res, 'login success') }

/**
 * @param {Request} req 
 * @param {Response} res 
 */
export async function register(req, res) {
  const body = req.body

  validator.validate(body, {
    names: 'required|string|min:4',
    username: 'required|string|min:4',
    email: 'required|email',
    password: 'required|string|min:5|max:255'
  })
  if (!validator.pass)
    return jsonError(res, validator.errors)

  let user = await User.findOne({
    where: {
      [Op.or]: [{ username: body.username }, { email: body.email }]
    }
  })
  if (user)
    return jsonError(res, 'the user already exists')

  user = await User.create({
    names: body.names,
    username: body.username,
    email: body.email,
    password: await encryptPass(body.password),
  })
  req.login(user, (error) => {
    if (error) { return jsonError(res, error.message) }
    return jsonOk(res, 'user created successfully')
  })
}

/**
 * @param {Request} req 
 * @param {Response} res 
 */
 export function logout(req, res, next) {
  req.logout( (error)=> {
    if (error) { return next(error) }
    jsonOk(res, 'logout success')
  })
}