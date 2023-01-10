import { DataTypes } from "sequelize"
import { connection } from "../database/connection.js"

export default connection.define('Continent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true,
    allowNull: false,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { notEmpty: true }
  }
},
{
  tableName: 'continents',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})