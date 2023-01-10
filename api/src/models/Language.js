import { DataTypes } from "sequelize"
import { connection } from "../database/connection.js"

export default connection.define('Language', {
  code: {
    type: DataTypes.STRING(3),
    primaryKey: true,
    unique: true,
    allowNull: false,
    validate: {
      len: 3,
      isAlpha: true
    }
  },
  name: {
    type: DataTypes.STRING,
    unique: false,
    allowNull: false,
    validate: { notEmpty: true }
  }
},
{
  tableName: 'languages',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})