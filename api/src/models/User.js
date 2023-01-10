import { DataTypes } from "sequelize"
import { connection } from "../database/connection.js"

export default connection.define('User', {
  names: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
      isAlphanumeric: true
    }
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  type: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    defaultValue: 0
  }
},
{
  tableName: 'users',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})