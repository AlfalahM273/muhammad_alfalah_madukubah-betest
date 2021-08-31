// // insert redis strategy in mongoose exec function
// const mongoose = require('mongoose')
const redis = require('redis')
// const util = require('util')
// client.hget = util.promisify(client.hget);  // enable redis to support promises

const redisUrl = 'redis://127.0.0.1:6379';
client = redis.createClient(redisUrl);
module.exports = {
    client    
}
