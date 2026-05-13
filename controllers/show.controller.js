const showService = require('../services/show.services');
const {successBody, errorBody} = require('../utils/response');
const logger = require('../utils/logger');

const createShow = async (req, res) => {
  try {
    logger.info(req.body);
    const response = await showService.createShow(req.body);

    return res.status(201).json(successBody(response, "show successfully Created"));
  } catch (error) {
    const status = error.statusCode || 500;
    logger.info(error.message)
        
    return res.status(status).json(
      errorBody(error, error.message || "Internal server error")
    );
  }
}

const updateShowById = async (req, res) => {
  try {
    const response = await showService.updateShowById(req.params.id, req.body);

    return res.status(200).json(successBody(response, "Updated the existing show"));
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json(errorBody(error, error.message));
  }
}

const deleteShowById = async (req, res) => {
  try {
    const response = await showService.deleteShowById(req.params.id);

    return res.status(200).json(successBody(response, `Deleted the existing show with given ID ${response._id}`));
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json(errorBody(error, error.message));
  }
}

const getShows = async (req, res) => {
  try {
    const filters = req.query;
    const city = req.params.city;
    const response = await showService.getShows(filters, city, req.pagination);


    return res.status(200).json(successBody(response, `Successfully fetched shows in ${city}`))
  } catch(error) {
    const status = error.statusCode || 500;
    return res.status(status).json(errorBody(error.message));
  }
}

const getShowByTheatreId = async(req, res) => {
  try {
    const response = await showService.getShowByTheatreId(req.params.id);

    return res.status(200).json(successBody(response, "Successfully fetched shows by theatreId"));
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json(errorBody(error.message));
  }
}

const getShowByTheatreName = async (req, res) => {
    try {
        const { city, name } = req.params;
        const { theatre, shows } = await showService.getShowByTheatreName(name, city);

        const responseData = {
            theatreDetails: {
                name: theatre.name,
                city: theatre.city,
                address: theatre.address
            },
            totalShows: shows.length,
            availableShows: shows
        };

        return res.status(200).json(
            successBody(responseData, "Successfully fetched theatre schedule")
        );
    } catch (error) {
        const status = error.statusCode || 500;
        return res.status(status).json(errorBody(error.message));
    }
};

const getShowByMovieName = async (req, res) => {
    try {
        const { city, name } = req.params;
        const { movie, shows } = await showService.getShowByMovieName(name, city);

        const responseData = {
            movieDetails: {
                name: movie.name,
                description: movie.description,
                casts: movie.casts,
                trailerUrl: movie.trailerUrl,
                releaseStatus: movie.releaseStatus,
                duration: movie.duration
            },
            totalShows: shows.length,
            availableShows: shows
        };

        return res.status(200).json(
            successBody(responseData, "Successfully fetched Movie schedule")
        );
    } catch (error) {
        const status = error.statusCode || 500;
        return res.status(status).json(errorBody(error.message));
    }
};

const getShowById = async (req, res) => {
  try {
    const response = await showService.getShowById(req.params.showId);

    return res.status(200).json(successBody(response, "Here is the show, BOOK TICKET now!"))
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json(errorBody(error.message));
  }
}

module.exports = {
  createShow,
  getShows,
  getShowByTheatreId,
  getShowByTheatreName,
  getShowByMovieName,
  getShowById,
  updateShowById,
  deleteShowById
}