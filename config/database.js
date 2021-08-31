const mongoose = require('mongoose');
exports.connect = () => {
    mongoConnection = process.env.MONGO_DB_URL;
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