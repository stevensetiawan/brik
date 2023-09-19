const validate = require('validate.js');

const pool = require('./redis_pool');
const logger = require('../helpers/logger');
const wrapper = require('./helpers/wrapper');
const { redisConfig } = require('./vars');

const redisConfig = {
  connection: {
    host: redisConfig.redis_host,
    port: redisConfig.redis_port,
    password: redisConfig.redis_password
  },
  index: redisConfig.redis_index
};

class Redis {
  async setExpire(key, value, expireType, expire) {
    let client = await pool.getConnection(redisConfig.connection);
    if (validate.isEmpty(client)) {
      client = await pool.createConnectionPool(redisConfig.connection);
    }

    const clientRedis = client[0].client;
    clientRedis.on('error', (err) => {
      return wrapper.error(err, 'Fail to get data from Redis');
    });

    clientRedis.setMaxListeners(0);

    return new Promise(((resolve, reject) => {
      clientRedis.select(redisConfig.index, async (err) => {
        if (err) {
          logger.error('redis-db', `change db to ${redisConfig.index}, : ${err}`, 'redis change db');
          return wrapper.error(err, 'Fail to select db on Redis');
        }
        /*
        * third param {{expireType}} can be replace
        * EX -- Set the specified expire time, in seconds.
        * PX -- Set the specified expire time, in milliseconds.
        * NX -- Only set the key if it does not already exist.
        * XX -- Only set the key if it already exist.
        */
        clientRedis.set(key, JSON.stringify(value), expireType, expire, (err, replies) => {
          if (err) {
            reject(wrapper.error(err, '', 404));
          }
          resolve(wrapper.data(replies));
        });
      });
    }));
  }

  async get(key) {
    let client = await pool.getConnection(redisConfig.connection);
    if (validate.isEmpty(client)) {
      client = await pool.createConnectionPool(redisConfig.connection);
    }

    const clientRedis = client[0].client;
    clientRedis.on('error', (err) => {
      return wrapper.error(err, 'Fail to get data from Redis');
    });

    clientRedis.setMaxListeners(0);

    return new Promise(((resolve, reject) => {
      clientRedis.select(redisConfig.index, async (err) => {
        if (err) {
          logger.error('redis-db', `change db to ${redisConfig.index}, : ${err}`, 'redis change db');
          return wrapper.error(err, 'Fail to select db on Redis');
        }
        clientRedis.get(key, (err, replies) => {
          if (err) {
            reject(wrapper.error(err, '', 404));
          }
          resolve(wrapper.data(replies));
        });
      });
    }));
  }

  async del(key) {
    let client = await pool.getConnection(redisConfig.connection);
    if (validate.isEmpty(client)) {
      client = await pool.createConnectionPool(redisConfig.connection);
    }

    const clientRedis = client[0].client;
    clientRedis.on('error', (err) => {
      return wrapper.error(err, 'Fail to get data from Redis');
    });

    clientRedis.setMaxListeners(0);

    return new Promise(((resolve, reject) => {
      clientRedis.select(redisConfig.index, async (err) => {
        if (err) {
          logger.error('redis-db', `change db to ${redisConfig.index}, : ${err}`, 'redis change db');
          return wrapper.error(err, 'Fail to select db on Redis');
        }

        clientRedis.del(key, (err, replies) => {
          if (err) {
            reject(wrapper.error(err, '', 404));
          }
          resolve(wrapper.data(replies));
        });
      });
    }));
  }

  async incr(key) {
    let client = await pool.getConnection(redisConfig.connection);
    if (validate.isEmpty(client)) {
      client = await pool.createConnectionPool(redisConfig.connection);
    }

    const clientRedis = client[0].client;
    clientRedis.on('error', (err) => {
      return wrapper.error(err, 'Fail to get data from Redis');
    });

    clientRedis.setMaxListeners(0);

    return new Promise(((resolve, reject) => {
      clientRedis.select(redisConfig.index, async (err) => {
        if (err) {
          logger.error('redis-db', `change db to ${redisConfig.index}, : ${err}`, 'redis change db');
          return wrapper.error(err, 'Fail to select db on Redis');
        }
        clientRedis.incr(key, (err, replies) => {
          if (err) {
            reject(wrapper.error(err, '', 404));
          }
          resolve(wrapper.data(replies));
        });
      });
    }));
  }
}

module.exports = Redis;
