/* eslint-disable no-unused-vars */
const { Pool } = require('pg');
const { postgres, env } = require('./vars');

// Setup
const pool = new Pool({
  host: postgres.db_host,
  port: postgres.db_port,
  database: postgres.db_name,
  user: postgres.db_user,
  password: postgres.db_password,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  timezone: 'Asia/Jakarta'
});

module.exports = {
  pool,
};
