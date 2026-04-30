const Movie = require('../models/movie.model');

const createMovie = async (movieData) => {
  try {
    const movie = await Movie.create(movieData);
    return movie;
  } 
  catch (error) {
    if (error.code === 11000) {
      const customError = new Error("Movie name already exists");
      customError.statusCode = 400;
      throw customError;
    }

    if (error.name === "ValidationError") {
      const customError = new Error(error.message);
      customError.statusCode = 400;
      throw customError;
    }
    throw error;
  }
}

const getMovieById = async (id) => {
  try {
    const movie = await Movie.findById(id).select("_id name description casts language releaseDate");
    return movie;
  } catch (error) {
    if (error.name === 'CastError') {
      const err = new Error("Invalid Movie ID format");
      err.statusCode = 400;
      throw err;
    }
    throw error;
  }
};

const getMovieByName = async (query) => {
  const movies = await Movie.find(query).select("_id name description casts language releaseDate");

  return movies;
}

const deleteMovie = async (id) => {
    try {
        const movie = await Movie.findByIdAndDelete(id);
        return movie;
    } catch (error) {
        if (error.name === 'CastError') {
            const err = new Error("Invalid Movie ID format");
            err.statusCode = 400;
            throw err;
        }
        throw error;
    }
};

const updateMovie = async (id, updateData) => {
    try {
        const movie = await Movie.findByIdAndUpdate(id, updateData, {
            new: true, // Returns the updated document
            runValidators: true // Ensures the enum and types are still valid
        });
        return movie;
    } catch (error) {
        if (error.name === "ValidationError") {
            const err = new Error(error.message);
            err.statusCode = 400;
            throw err;
        }
        throw error;
    }
};



module.exports = {
  createMovie,
  getMovieById,
  getMovieByName,
  deleteMovie,
  updateMovie
}