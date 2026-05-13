const movieService = require('../services/movie.services')
const {successBody, errorBody} = require('../utils/response')
const logger = require('../utils/logger');


const createMovie = async (req, res) => {
    try {
        const response = await movieService.createMovie(req.body);

        return res.status(201).json(
            successBody(response, "New Movie Added")
        );

    } catch (error) {
        const status = error.statusCode || 500;
        logger.info(error.message)
        
        return res.status(status).json(
            errorBody(error.message || "Internal server error", error)
        );
    }
};


const getMovieById = async (req, res) => {
    try {
      const movie = await movieService.getMovieById(req.params.id);

      return res.status(200).json(successBody(movie, "Found the movie"));

    } catch (error) {
      return res.status(500).json(errorBody(error.message));
    }
};

const getMovieByName = async (req, res) => {
  try {
    let query = {};
    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: "i" };
    }

    const movies = await movieService.getMovieByName(query);

    if (movies.length === 0) {
      return res.status(404).json(errorBody("No movies found matching that criteria"));
    }

    return res.status(200).json(successBody(movies, "Movies retrieved successfully"));
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json(errorBody(error.message));
  }
};

const deleteMovie = async (req, res) => {
    try {
        const movie = await movieService.deleteMovie(req.params.id);
        if (!movie) {
            return res.status(404).json(errorBody("Movie not found"));
        }
        return res.status(200).json(successBody(movie, "Successfully deleted movie"));
    } catch (error) {
        const status = error.statusCode || 500;
        return res.status(status).json(errorBody(error.message));
    }
};

const updateMovie = async (req, res) => {
  try {
    const {id} = req.params;

    const movie = await movieService.updateMovie(id, req.body);

    if(!movie){
      return res.status(404).json(errorBody("Movie not found, Invalid Id"))
    }

    return res.status(200).json(successBody(movie, "Successfully updated movie"));


  } catch (error) {
    logger.error(error);
    return res.status(500).json({message: "Internal server error"});
  }
}

module.exports = {
  createMovie,
  getMovieById,
  getMovieByName,
  deleteMovie,
  updateMovie
}