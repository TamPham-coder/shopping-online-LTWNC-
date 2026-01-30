// server/utils/MongooseUtil.js

const mongoose = require('mongoose');
const MyConstants = require('./MyConstants');

const uri = `mongodb+srv://${MyConstants.DB_USER}:${MyConstants.DB_PASS}@${MyConstants.DB_SERVER}/${MyConstants.DB_DATABASE}?retryWrites=true&w=majority`;

mongoose.connect(uri)
  .then(() => {
    console.log(`Connected to MongoDB: ${MyConstants.DB_SERVER}/${MyConstants.DB_DATABASE}`);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Optional: thêm để tránh warning deprecated
mongoose.set('strictQuery', true);