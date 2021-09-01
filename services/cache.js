const redis = require('redis')

client = redis.createClient({
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});
module.exports = client
