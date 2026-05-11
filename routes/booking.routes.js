const express = require('express');
const router = express.Router();
const {validate} = require('../middlewares/movie.middleware');
const {createBooking, getMyBookings, cancelBooking, getAllBookingOfOwnTheatre, getBookingById, getTotalRevenue, getRevenuePerMovie, getTotalRevenueTheatre, verifyTicket} = require('../controllers/booking.controller')
const {bookingCreateSchema, bookingUpdateSchema} = require('../validators/booking.validator');

const{isLoggedIn, isAdmin, isTheatreOwner, isAppUser} = require('../middlewares/auth.middleware');


// -------- USER ROUTES ----------
router.post('/', validate(bookingCreateSchema), isLoggedIn, isAppUser, createBooking);
router.get('/mine', isLoggedIn, isAppUser, getMyBookings);
router.patch('/:id/cancel', isLoggedIn, isAppUser, cancelBooking);

// -------- OWNER ROUTES ----------

router.get('/owner/theatre/revenue/all', isLoggedIn, isTheatreOwner, getTotalRevenueTheatre)

router.get('/owner/theatre/:theatreId', isLoggedIn, isTheatreOwner, getAllBookingOfOwnTheatre);

router.get('/owner/theatre/revenue/:theatreId', isLoggedIn, isTheatreOwner, getTotalRevenue)

router.get('/owner/movie/revenue/:theatreId', isLoggedIn, isTheatreOwner, getRevenuePerMovie)

router.get('/owner/theatre/:theatreId/:bookingId', isLoggedIn, isTheatreOwner, getBookingById)

router.get('/owner/booking/:bookingId', isLoggedIn, isTheatreOwner, verifyTicket)




module.exports = router;