import { DataTypes } from "sequelize"
import { connection } from "../database/connection.js"
import Country from "./Country.js"
import Currency from "./Currency.js"

export default connection.define('CountryCurrency', {
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
  currency_code: {
    type: DataTypes.STRING(3),
    unique: false,
    allowNull: false,
    references: {
      model: Currency,
      key: 'code'
    }
  }
},
{
  tableName: 'country_currencies',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})