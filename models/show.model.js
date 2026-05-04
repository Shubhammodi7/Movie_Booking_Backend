const mongoose = require('mongoose');
const Movie = require('./movie.model');
const Theatre = require('./theatre.model');

const showSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  theatre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theatre',
    required: true
  },
  timings: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true
  },
  format: {
    type: String,
    enum: ['2D', '3D', 'IMAX'],
  },
  language: {
    type: String,
    required: [true, "Language is required"]
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  totalSeats: {
    type: Number,
    required: true
  }
}, {timestamps: true});


module.exports = mongoose.model('Show', showSchema);