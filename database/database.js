const mongoose = require('mongoose');
require('dotenv').config(); 
const mongoDB = process.env.MONGO_URI ||'mongodb://127.0.0.1:27017/teabussiness';
mongoose.connect(mongoDB, { serverApi: { version: '1', strict: true, deprecationErrors: true } });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB连接错误'));
db.once('open', function() {
  console.log('MongoDB连接成功');
});

module.exports = db;
