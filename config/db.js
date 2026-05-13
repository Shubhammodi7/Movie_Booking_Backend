const mongoose = require('mongoose');
const dotenvResult = require('dotenv').config()
const { MONGO_URI } = dotenvResult.parsed || {}
const logger = require('../utils/logger');

const connectToDb = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info('MONGODB connected successfully');
  } catch (error) {
    logger.error('Error connecting to MONGODB:', error);
  }
}

module.exports = connectToDb;