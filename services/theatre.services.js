const Theatre = require('../models/theatre.model');

const createTheatre = async (theatreData) => {
  try {
    const theatre = await Theatre.create(theatreData);
    return theatre;
  } catch (error) {
    if (error.code === 11000) {
      const customError = new Error("Theatre name already exists");
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

const getAllTheatre = async (query) => {
  const theatres = await Theatre.find(query);
  return theatres;
}

const getTheatreById = async (id) => {
  try {
    const theatre = await Theatre.findById(id);
    return theatre;
  }
  catch(err) {
    if (err.name === 'CastError') {
      const err = new Error("Invalid Movie ID format");
      err.statusCode = 400;
      throw err;
    }
    throw err;
  }
}

const updateTheatre = async (id, updatedData) => {
  try {
    const theatre = await Theatre.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true
    });

    return theatre;
  } catch (error) {
    if (error.name === "ValidationError") {
      const err = new Error(error.message);
      err.statusCode = 400;
      throw err;
    }
    throw error;
  }
}

const deleteTheatre = async (id) => {
  try{
    const theatre = await Theatre.findByIdAndDelete(id);
    return theatre;
  }
  catch(error){
    if (error.name === "ValidationError") {
      const err = new Error(error.message);
      err.statusCode = 400;
      throw err;
    }
    throw error;
  }
}

module.exports = {createTheatre, getAllTheatre, getTheatreById, updateTheatre, deleteTheatre}