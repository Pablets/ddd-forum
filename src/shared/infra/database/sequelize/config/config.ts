import dotenv from 'dotenv';

dotenv.config();

const {
  DDD_FORUM_DB_USER = 'tonysoprano',
  DDD_FORUM_DB_PASS = '12345678',
  DDD_FORUM_DB_HOST = 'localhost',
  DDD_FORUM_DB_DEV_DB_NAME = 'data_dev',
  DDD_FORUM_DB_TEST_DB_NAME = 'data_test',
  DDD_FORUM_DB_PROD_DB_NAME = 'data_prod',
  NODE_ENV = 'development',
  DDD_FORUM_IS_PRODUCTION = 'false',
  CLEARDB_DATABASE_URL,
} = process.env;

export const databaseCredentials = {
  development: {
    username: DDD_FORUM_DB_USER,
    password: DDD_FORUM_DB_PASS,
    database: DDD_FORUM_DB_DEV_DB_NAME,
    host: DDD_FORUM_DB_HOST,
    dialect: 'mysql',
  },
  test: {
    username: DDD_FORUM_DB_USER,
    password: DDD_FORUM_DB_PASS,
    database: DDD_FORUM_DB_TEST_DB_NAME,
    host: DDD_FORUM_DB_HOST,
    dialect: 'mysql',
  },
  production: {
    username: DDD_FORUM_DB_USER,
    password: DDD_FORUM_DB_PASS,
    database: DDD_FORUM_DB_PROD_DB_NAME,
    host: DDD_FORUM_DB_HOST,
    dialect: 'mysql',
  },
};

export const config = databaseCredentials[NODE_ENV];

module.exports = {
  ...config,
};

export default config;
