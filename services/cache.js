// // insert redis strategy in mongoose exec function
// const mongoose = require('mongoose')
const redis = require('redis')
// const util = require('util')
// client.hget = util.promisify(client.hget);  // enable redis to support promises

client = redis.createClient({
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});
module.exports = {
    client    
}
