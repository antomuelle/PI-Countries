import { DataTypes } from "sequelize"
import { connection } from "../database/connection.js"
import Country from "./Country.js"
import Language from "./Language.js"

export default connection.define('CountryLanguage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true,
    allowNull: false,
    autoIncrement: true,
  },
  country_id: {
    type: DataTypes.STRING(3),
    unique: false,
    allowNull: false,
    references: {
      model: Country,
      key: 'id'
    }
  },
  language_code: {
    type: DataTypes.STRING(3),
    unique: false,
    allowNull: false,
    references: {
      model: Language,
      key: 'code'
    }
  }
},
{
  tableName: 'country_languages',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})