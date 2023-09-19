const Redis = require('ioredis');
const { redisConfig } = require('./vars');
const redis = new Redis({
    host: redisConfig.redis_host,
    port: redisConfig.redis_port,
    db: redisConfig.redis_index,
});

module.exports = {
    
    get: async function(key){
        var result = null
        var error = null
        try{
            result = await redis.get(key);
        }catch(err){
            console.log(err)
            error = err
        }
        return [result, error]
    },
    set: async function(key, value, exp){
        var result = false
        var error = null
        try {
            await redis.set(key, value, 'EX', exp);
            result = true
        } catch (err) {
            console.log(err)
            error = err
        }
        return [result, error]
    },


    hgetall: async function(key){
        var result = null
        var error = null
        try{
            result = await redis.hgetall(key);
        }catch(err){
            console.log(err)
            error = err
        }
        return [result, error]
    },

    hset: async function(key, value){
        var result = false
        var error = null
        try {
            await redis.hset(key, value, function(err, reply){
                return reply
            });
            result = true
        } catch (err) {
            console.log(err)
            error = err
        }
        return [result, error]
    },

    delete: async function(key){
        var result = false
        var error = null
        try {
            await redis.del(key);
            result = true
        } catch (err) {
            console.log(err)
            error = err
        }
        return [result, error]
    },

    flushdb: async function(){
        var result = false
        var error = null
        try {
            await redis.flushdb();
            result = true
        } catch (err) {
            console.log(err)
            error = err
        }
        return [result, error]
    }
}
