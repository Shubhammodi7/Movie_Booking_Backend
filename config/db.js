const mongoose = require('mongoose');

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MONGODB connected successfully');
  } catch (error) {
    console.error('Error connecting to MONGODB:', error);
  }
}

module.exports = connectToDb;