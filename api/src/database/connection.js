import { Sequelize } from "sequelize"

const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST
} = process.env;

const DB_NAME = 'food'

export const connection = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  {
    host: DB_HOST,
    dialect: 'postgres',
    logging: false,
    native: false
  }
)