import { DataTypes } from "sequelize"
import { connection } from "../database/connection.js"

export default connection.define('Activity', {
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  difficulty: {
    type: DataTypes.INTEGER,
    unique: false,
    allowNull: false,
    validate: { len: [1, 5], isInt: true }
  },
  duration: {
    type: DataTypes.INTEGER,
    unique: false,
    allowNull: false,
    defaultValue: 0,
    validate: { isInt: true }
  },
  season: {
    type: DataTypes.STRING,
    unique: false,
    allowNull: false,
    defaultValue: 'summer',
    validate: { isIn: ['spring', 'summer', 'autumn', 'winter'] }
  }
},
{
  tableName: 'activities',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})