const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    unique: true,

  },
  description: {
    type: String,
    required: [true, "Description is required"],
    minLength: [5, "Description should more than 5 word"]

  },
  casts: {
    type: [String],
    required: [true, "Cast is required"],
  },
  trailerUrl: {
    type: String,
    required: true
  },
  language: {
    type: [String],
    required: [true, "Languages are required is required"],
    default: "English"
  },
  releaseDate: {
    type: String,
    required: [true, "Release Date  is required"]
  },
  director: {
    type: String,
    required: [true, "Cast is required"]
  },
  releaseStatus: {
    type: String,
    required: [true, "Cast is required"],
    enum: ["RELEASED", "BLOCKED", "UNRELEASED"]
  },
  duration: {
    type: Number,
    required: [true, 'duration should be in number as Minutes (e.g 120 it will considered 120mins']
  }
}, {timestamps: true});

module.exports = mongoose.model('Movie', movieSchema);