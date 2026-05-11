const bookingService = require('../services/booking.services');
const {successBody, errorBody} = require('../utils/response')


// -------- USER CONTROLLERS ----------
const createBooking = async (req, res) => {
  try {
    
    const response = await bookingService.createBooking({...req.body, user: req.user._id});

    return res.status(201).json(successBody(response, "Your booking successful"))
  } catch (error) {
    const status = error.statusCode || 500;
    console.error(`[Booking Error]: ${error.message}`);
            
    return res.status(status).json(
      errorBody(error, error.message || "Internal server error")
    );
  }
}

const getMyBookings = async (req, res) => {
  try {

    const response = await bookingService.getMyBookings(req.user.id, req.query);

    if(response.length === 0) {
      return res.status(200).json(successBody(response, "You havent book any movie ticket yet"));
    }

    return res.status(200).json(successBody(response, "Successfully fetched all your bookings"));

  } catch (error) {
    const status = error.statusCode || 500;

    return res.status(status).json(errorBody(error, error.message));
  }
}

const cancelBooking = async (req, res) => {
  try {
    const {id} = req.params;
    const response = await bookingService.cancelBooking(req.user.id, id);

    return res.status(200).json(successBody(response, "SuccessFully cancelled your booking"));
  } catch (error) {
    const status = error.statusCode || 500;

    res.status(status).json(errorBody(error, error.message));
  }
}

// -------- ADMIN OR THEATRE OWNER CONTROLLERS ----------

const getAllBookingOfOwnTheatre = async (req, res) => {
  try {
    const {theatreId} = req.params;
    const response = await bookingService.getAllBookingOfOwnTheatre(req.user.id, theatreId);

    return res.status(200).json(successBody(response, "Fetched all bookings of your theatre"));
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json(errorBody(error, error.message))
  }
}

const getBookingById = async (req, res) => {
  try {
    const {theatreId, bookingId} = req.params;
    const response = await bookingService.getBookingById(req.user.id, theatreId, bookingId);

    return res.status(200).json(successBody(response, "Fetched booking with Booking ID of your theatre"));
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json(errorBody(error, error.message))
  }
}

const getTotalRevenue = async (req, res) => {
  try {
    const {theatreId} = req.params;
    const response = await bookingService.getTotalRevenue(theatreId, req.user.id);

    return res.status(200).json(successBody(response, "See your theatre details"))
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json(errorBody(error, error.message));
  }
}

const getTotalRevenueTheatre = async (req, res) => {
  try {
    const response = await bookingService.getTotalRevenueTheatre(req.user.id);

    return res.status(200).json(successBody(response, "See Total theatres Revenue details"))
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json(errorBody(error, error.message));
  }
}

const getRevenuePerMovie = async (req, res) => {
  try {
    const {theatreId} = req.params;
    const response = await bookingService.getRevenuePerMovie(theatreId, req.user.id);

    return res.status(200).json(successBody(response, "See Your Revenue Per Movie"))
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json(errorBody(error, error.message));
  }
}

const verifyTicket = async (req, res) => {
  try {
    const {bookingId} = req.params;
    const response = await bookingService.verifyTicket(bookingId, req.user.id);

    return res.status(200).json(successBody(response, "Ticket verified. Entry allowed."));
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json(errorBody(error, error.message));
  }
}

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookingOfOwnTheatre,
  getBookingById,
  getTotalRevenue,
  getRevenuePerMovie,
  getTotalRevenueTheatre,
  verifyTicket
}
