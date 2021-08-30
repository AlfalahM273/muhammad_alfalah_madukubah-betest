const mongoose = require('mongoose');
exports.connect = () => {
    const mongoUser = process.env.MONGO_USER;
    const mongoPassword = process.env.MONGO_PASSWORD;
    const mongoHost = process.env.MONGO_HOST;
    const mongoDb = process.env.MONGO_DB;
    let mongoConnection = "";
    if (mongoUser || mongoPassword){
      mongoConnection = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}/${mongoDb}`;
    }
    else{
      mongoConnection = `mongodb://${mongoHost}/${mongoDb}`;
    }
    mongoose.connect(mongoConnection, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .catch(err => {
        console.error(`Failed to connect to MongoDB: ${err.message}`);
    });
    const connection = mongoose.connection;
    connection.once('open', () => {
        console.log('Connected to MongoDB');
    })
  }