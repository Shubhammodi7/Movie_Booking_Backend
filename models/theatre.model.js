const mongoose = require('mongoose');
const Movie = require('./movie.model');

const theatreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  city: {
    type: String,
    required: true
  },
  pinCode: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  movies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }]
}, {timestamps: true});

const Theatre = mongoose.model('Theatre', theatreSchema)
module.exports = Theatre;