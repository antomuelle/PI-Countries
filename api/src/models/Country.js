import { DataTypes } from "sequelize"
import { connection } from "../database/connection.js"
import Continent from "./Continent.js"

export default connection.define('Country', {
  id: {
    type: DataTypes.STRING(3),
    primaryKey: true,
    unique: true,
    allowNull: false,
    validate: {
      len: [3, 3],
      isAlphanumeric: true
    }
  },
  cca2: {
    type: DataTypes.STRING(2),
    unique: true,
    allowNull: false,
    validate: {
      len: [2, 2],
      isAlphanumeric: true
    }
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  official_name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  image: {
    type: DataTypes.STRING,
    unique: false,
    allowNull: false,
    validate: { isUrl: true, notEmpty: true }
  },
  capital: {
    type: DataTypes.STRING,
    unique: false,
    allowNull: true,
    defaultValue: null,
    validate: { notEmpty: true }
  },
  continent_id: {
    type: DataTypes.INTEGER,
    unique: false,
    allowNull: false,
    references: {
      model: Continent,
      key: 'id'
    }
  },
  subregion: {
    type: DataTypes.STRING,
    unique: false,
    allowNull: true,
    defaultValue: null,
    validate: { notEmpty: true }
  },
  area: {
    type: DataTypes.DECIMAL,
    unique: false,
    allowNull: false,
    validate: { min: -1, notEmpty: true }
  },
  population: {
    type: DataTypes.INTEGER,
    unique: false,
    allowNull: false,
    validate: { isInt: true, min: 0, notEmpty: true }
  }
},
{
  hooks: {
    afterFind: (country, options) => {
      if (Array.isArray(country)) {
        country.forEach(c => { c.dataValues.continent = c.continent.name })
      }
      else {
        country.dataValues.continent = country.continent.name
      }
    }
  },
  tableName: 'countries',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})