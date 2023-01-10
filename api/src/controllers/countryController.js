/** @typedef { import('express').Request } Request */
/** @typedef { import('express').Response } Response */
import fs from 'fs'
import path from 'path'
import { config } from "dotenv";config()
import { validator } from "../code/validator.js"
import { jsonOk, jsonError } from '../code/utils.js';
import { sequelize } from '../database/relations.js';
import { Op } from 'sequelize';

const { Activity, Continent, Country, Currency, Language } = sequelize.models

/** @param {Request} req @param {Response} res */
export async function getCountries(req, res) {
  validator.validate(req.query, {
    offset: 'integer|min:0|not_empty',
    limit: 'integer|min:1|not_empty',
    name: 'string|min:2|not_empty',
  })
  if (!validator.pass) return jsonError(res, { errors: validator.errors })

  const request = {
    attributes: ['id', 'name', 'image'],
    include: { model: Continent, as:'continent', attributes: ['name'] },
    offset: req.query.offset ?? 0,
    limit: req.query.limit ?? 10,
  }
  if (req.query.name) request.where = { name: { [Op.iLike]: `%${req.query.name}%` } }

  try {
    const result = await Country.findAll(request)
    result.length ? jsonOk(res, result) : jsonError(res, 'No countries found', 404)
  }
  catch (error) { jsonError(res, error.message) }
}

/** @param {Request} req @param {Response} res */
export async function getCountry(req, res) {
  validator.validate(req.params, { id: 'required|string|min:3' })
  if (!validator.pass) return jsonError(res, { errors: validator.errors })

  try {
    const country = await Country.findOne({
      attributes: { exclude: ['created_at', 'updated_at', 'continent_id']},
      where: { id: req.params.id.toUpperCase() },
      include: [
        { model: Continent, as: 'continent', attributes: ['name'] },
        { model: Language, as: 'languages', attributes: ['code', 'name'] },
        { model: Currency, as: 'currencies', attributes: ['code', 'name', 'symbol'], through: { attributes: [] } },
        { model: Activity, as: 'activities', attributes: { exclude: ['created_at', 'updated_at'] } },
      ]
    })
    if (!country) return jsonError(res, 'country not found', 404)
    return jsonOk(res, country)
  }
  catch (error) { jsonError(res, error.message) }
}

export async function createActivity(req, res) {
  if (!validator.validate(req.body, {
    name: 'required|string|min:2',
    difficulty: 'required|integer|min:1|max:5',
    duration: 'required|integer|min:1',
    season: 'required|string|min:2',
    countries: 'array',
  })) return jsonError(res, { errors: validator.errors })

  try {
    const activity = await Activity.create(req.body)
    if (req.body.countries) {
      const countries = await Country.findAll({ where: { id: req.body.countries } })
      await activity.addCountries(countries)
    }
    jsonOk(res, activity)
  }
  catch (error) { jsonError(res, error.message) }
}

export function uploadImage(req, res) {
  if (!validator.validate(req.body, { name: 'required|string' }))
    return jsonError(res, { errors: validator.errors })
  
  try {
    const tmp_file = path.resolve(req.file.path)
    if (!req.file.mimetype.startsWith('image/')) {
      fs.unlinkSync(tmp_file)
      return jsonError(res, 'the file is not an image')
    }

    const extension = req.file.originalname.substring(req.file.originalname.lastIndexOf('.') + 1)
    const file_name = req.file.filename + '.' + extension
    fs.renameSync(tmp_file, path.resolve('public/images/' + file_name))
    jsonOk(res, { message: 'file uploaded', path: '/images/' + file_name })
  }
  catch (error) { jsonError(res, error.message) }
}