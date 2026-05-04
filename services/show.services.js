const Show = require('../models/show.model');
const Movie = require('../models/movie.model');
const Theatre = require('../models/theatre.model');

const createShow = async (showData) => {
  try {
    const movie = await Movie.findById(showData.movie);
    if(!movie) {
      throw new Error("The movie you're trying to schedule doesn't exist", 404);
    }

    const theatre = await Theatre.findById(showData.theatre);
    if(!theatre) {
      throw new Error("The theatre you're trying to schedule doesn't exist", 404);
    }

    showData.availableSeats = showData.totalSeats;

    const show = await Show.create(showData);

    return show;
  } catch (error) {
    if (error.name === "ValidationError") {
      const customError = new Error(error.message);
      customError.statusCode = 400;
      throw customError;
    }
    throw error;
  }
}

const updateShowById = async (id, updatedData) => {
  try {
    const show = await Show.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true
    });

    return show;
  } catch (error) {
    if (error.name === "ValidationError") {
      const err = new Error(error.message);
      err.statusCode = 400;
      throw err;
    }
    throw error;
  }
}

const deleteShowById = async (id) => {
  try{
    const show = await Show.findByIdAndDelete(id);
    return show;
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

const getShows = async(filters, city, pagination) => {
    const {language, format, movie} = filters;
    const { skip, limit, page } = pagination;
    let query = {};

    // if(!city) {
    //   const error = new Error("Please select a city to see available shows");
    //   error.status = 400;
    //   throw error;
    // }

      const theatresInCity = await Theatre.find( {city: {$regex: city, $options: 'i'}}).select('_id');

      const theatreIds = theatresInCity.map(t => t._id);

      if (theatreIds.length === 0) {
        return [];
    }

      query.theatre = {$in: theatreIds};

    if(movie) query.movie = movie;
    if(language) query.language = { $regex: `^${language}`, $options: 'i' };
    if(format) query.format = format;

    query.timings = {$gte: new Date()};

    const [shows, total] = await Promise.all([
        Show.find(query)
            .populate('movie')
            .populate('theatre')
            .limit(limit)
            .skip(skip)
            .sort({ timings: 1 }),
        Show.countDocuments(query)
    ]);

    return { 
        shows, 
        total, 
        page, 
        totalPages: Math.ceil(total / limit) 
    };
}

const getShowByTheatreId = async (theatreId) => {
  const show = await Show.find({theatre: theatreId})
    .populate('movie', 'name description language director duration')
    .populate('theatre', 'name city address')
    .select('timings price format language availableSeats totalSeats')
    .sort({ timings: 1 });

  if(!show || show.length === 0){
    const error = new Error("No shows found for this theatre. Please check the ID");
      error.statusCode = 404;
      throw error;
  }

  return show;
}

const getShowByTheatreName = async (theatreName, city) => {
  const theatre = await Theatre.findOne({ 
        name: { $regex: `^${theatreName}$`, $options: 'i' },
        city: { $regex: `^${city}$`, $options: 'i' }
    });

  if (!theatre) {
        const error = new Error("Theatre not found in your city");
        error.statusCode = 404;
        throw error;
    }

  const shows = await Show.find({ theatre: theatre._id })
        .populate('movie', 'name description language director duration')
        .select('timings price format language availableSeats totalSeats')
        .sort({ timings: 1 });


    if(!shows || shows.length === 0){
      const error = new Error("No shows found for this theatre in your city. Please check the name");
        error.statusCode = 404;
        throw error;
    }
  return {theatre, shows};
}

const getShowByMovieName = async (movieName, city) => {
  const movie = await Movie.findOne({name: { $regex: movieName, $options: 'i'}});

  if (!movie) {
        const error = new Error("Movie not found ");
        error.statusCode = 404;
        throw error;
    }

  const theatresInCity = await Theatre.find({city: {$regex: city, $options: 'i'}}).select('_id');

  const theatreIds = theatresInCity.map(t => t._id);

  const shows = await Show.find({
    movie: movie._id,
  theatre: { $in: theatreIds},
    timings: {$gte: new Date()}
  })
        .populate('theatre', 'name city address')
        .select('timings price format language availableSeats totalSeats')
        .sort({ timings: 1 });

  return {movie, shows};
}

const getShowById = async (showId) => {
  const show = await Show.findById(showId)
      .populate('movie', 'name language director duration')
      .populate('theatre', 'name city address');

  if(!show){
    const error = new Error("Show not found");
    error.statusCode = 404;
    throw error
  }

  return show;
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