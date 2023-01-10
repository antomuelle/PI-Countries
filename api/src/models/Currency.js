import { DataTypes } from "sequelize"
import { connection } from "../database/connection.js"

export default connection.define('Currency', {
  code: {
    type: DataTypes.STRING(3),
    primaryKey: true,
    unique: true,
    allowNull: false,
    validate: {
      len: 3,
      isAlpha: true,
      isUppercase: true
    }
  },
  name: {
    type: DataTypes.STRING,
    unique: false,
    allowNull: false,
    validate: { notEmpty: true }
  },
  symbol: {
    type: DataTypes.STRING,
    unique: false,
    allowNull: true,
    defaultValue: null,
    validate: { notEmpty: true }
  }
},
{
  tableName: 'currencies',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})