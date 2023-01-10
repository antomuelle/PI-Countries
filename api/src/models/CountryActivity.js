import { DataTypes } from "sequelize"
import { connection } from "../database/connection.js"
import Activity from "./Activity.js"
import Country from "./Country.js"

export default connection.define('CountryActivity', {
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
  activity_id: {
    type: DataTypes.INTEGER,
    unique: false,
    allowNull: false,
    references: {
      model: Activity,
      key: 'id'
    }
  }
},
{
  tableName: 'country_activities',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})