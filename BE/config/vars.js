const path = require('path');

// import .env variables
require('dotenv-safe').config({
  path: path.join(__dirname, '../.env'),
  example: path.join(__dirname, '../.env.example'),
  allowEmptyValues: true
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  postgres: {
    db_host: process.env.NODE_ENV === 'development' ? process.env.DB_HOST_DEV : process.env.DB_HOST_PROD,
    db_port: process.env.NODE_ENV === 'development' ? process.env.DB_PORT_DEV : process.env.DB_PORT_PROD,
    db_user: process.env.NODE_ENV === 'development' ? process.env.DB_USER_DEV : process.env.DB_USER_PROD,
    db_password: process.env.NODE_ENV === 'development' ? process.env.DB_PASS_DEV : process.env.DB_PASS_PROD,
    db_name: process.env.NODE_ENV === 'development' ? process.env.DB_NAME_DEV : process.env.DB_NAME_PROD,
  },
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  redisConfig:{
    redis_host: process.env.NODE_ENV === 'development' ? process.env.REDIS_HOST_DEV : process.env.REDIS_HOST_PROD,
    redis_port: process.env.NODE_ENV === 'development' ? process.env.REDIS_PORT_DEV : process.env.REDIS_PORT_PROD,
    redis_password: process.env.NODE_ENV === 'development' ? process.env.REDIS_PASSWORD_DEV : process.env.REDIS_PASSWORD_PROD,
    redis_index: process.env.REDIS_INDEX
  },
  emailConfig: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
  },
};
