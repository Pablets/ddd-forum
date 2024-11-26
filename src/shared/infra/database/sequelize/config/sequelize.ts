import { Sequelize } from 'sequelize';
import config from './config';
import dotenv from 'dotenv';
dotenv.config();

const mode = process?.env?.DDD_FORUM_IS_PRODUCTION === 'true' ? 'prod' : 'dev';

export const prodDbUrl = process.env.CLEARDB_DATABASE_URL;

const { username, password, database, host, dialect } = config;

console.log(`[DB]: Connecting to the database in ${mode} mode.`);

export const sequelize =
  mode === 'prod'
    ? new Sequelize(prodDbUrl)
    : new Sequelize(database, username, password, {
        host,
        dialect,
        port: 3306,
        dialectOptions: {
          multipleStatements: true,
        },
        pool: {
          max: 5,
          min: 0,
          idle: 10000,
        },
        logging: false,
      });
