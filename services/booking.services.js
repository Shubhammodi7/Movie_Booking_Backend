const Booking = require('../models/booking.model');
const Show = require('../models/show.model')
const Theatre = require('../models/theatre.model');
const mongoose = require('mongoose');

// -------- USER SERVICES ----------

const createBooking = async (bookingData) => {
  let seatsReserved = false;
  try {

    const show = await Show.findById(bookingData.show);

    if(!show) {
      const error = new Error("Show doesn't exist")
      error.statusCode = 404
      throw new error;
    }

    if(new Date() > new Date(show.timings)){
      const error = new Error("Show has already started");
      error.statusCode = 400;
      throw error;
    }

    const updatedShow = await Show.findOneAndUpdate(
      {
        _id: bookingData.show,
        availableSeats: {$gte: bookingData.noOfSeats}
      },
      {
        $inc: {availableSeats: -bookingData.noOfSeats}
      },
      {new: true}
    );

    if (!updatedShow) {
      const error = new Error('Not enough seats available');
      error.statusCode = 400;
      throw error;
    }

    const booking = await Booking.create({
      ...bookingData,
      totalCost: updatedShow.price * bookingData.noOfSeats,
      movie: updatedShow.movie,
      theatre: updatedShow.theatre,
      status: "BOOKED"
    });

    seatsReserved = true;

    return booking;

  } catch (error) {

    if (seatsReserved) {
      await Show.findByIdAndUpdate(bookingData.show, {
        $inc: { availableSeats: +bookingData.noOfSeats }
      });
    }
    
    if (error.name === "ValidationError") {
      const customError = new Error(error.message);
      customError.statusCode = 400;
      throw customError;
    }
    throw error;
  }
}

const getMyBookings = async (userId, query) => {
  const filter = {...query, user: userId};

  const bookings = await Booking.find(filter)
    .populate({
      path: 'movie',
      select: 'name description trailerUrl releaseStatus'
    })
    .populate({
      path: 'theatre',
      select: 'name location pinCode'
    })
    .populate({
      path: 'show',
      select: 'timings format language'
    })
    .sort({createdAt: -1})

  return bookings.map(booking => {
    if(booking.status === 'BOOKED' && new Date() > new Date(booking.show.timings)){
      return {...booking.toObject(), status: 'EXPIRED'};
    }

    return bookings;
  });
}

const cancelBooking = async (userId, bookingId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    const error = new Error('Booking not found');
    error.statusCode = 404;
    throw error;
  }

  if(!booking.user.equals(userId)) {
    const error = new Error('Unauthorized: This is not your booking');
    error.statusCode = 403;
    throw error;
  }

  if (booking.status === 'CANCELLED') {
    throw new Error('Booking is already cancelled');
  }

  if(new Date() > new Date(booking.show.timings)){
    throw new Error('Cannot cancel a show that has already started or ended');
  }

  await Show.findByIdAndUpdate(booking.show._id, {
    $inc: {availableSeats: booking.noOfSeats}
  });

  booking.status = 'CANCELLED'
  await booking.save();


  return await booking.populate([
    { path: 'movie', select: 'name description' },
    { path: 'theatre', select: 'name location' }
  ]);

}

// -------- ADMIN OR THEATRE OWNER SERVICES ----------

const getAllBookingOfOwnTheatre = async (ownerId, theatreId) => {
  const theatre = await Theatre.findById(theatreId);
  if(!theatre) {
    const error = new Error('Theatre not found');
    error.statusCode = 404;
    throw error;
  }

  if(!theatre.owner.equals(ownerId)){
    const error = new Error('You are not the owner of this theatre');
    error.statusCode = 404;
    throw error;
  }

  if(!theatre.isApproved){
    const error = new Error("Theatre is not approved");
    error.statusCode = 403;
    throw error;
  }


  const bookings = await Booking.find({ theatre: theatreId })
    .populate('movie', 'name')
    .populate('user', 'name email')
    .populate('show', 'datetime format')
    .sort({ createdAt: -1 });

  return bookings;
}

const getBookingById = async (ownerId, theatreId, bookingId) => {
  const theatre = await Theatre.findById(theatreId);
  if(!theatre) {
    const error = new Error('Theatre not found');
    error.statusCode = 404;
    throw error;
  }

  if(!theatre.owner.equals(ownerId)){
    const error = new Error('You are not the owner of this theatre');
    error.statusCode = 404;
    throw error;
  }

  if(!theatre.isApproved){
    const error = new Error("Theatre is not approved");
    error.statusCode = 403;
    throw error;
  }


  const bookings = await Booking.findById(bookingId)
    .populate('movie', 'name')
    .populate('user', 'name email')
    .populate('show', 'datetime format')

  return bookings;
}

const getTotalRevenue = async (theatreId, ownerId, filters = {}) => {
  const theatre = await Theatre.findById(theatreId);
  if(!theatre) {
    const error = new Error('Theatre not found');
    error.statusCode = 404;
    throw error;
  }

  if(!theatre.owner.equals(ownerId)){
    const error = new Error('You are not the owner of this theatre');
    error.statusCode = 404;
    throw error;
  }

  if(!theatre.isApproved){
    const error = new Error("Theatre is not approved");
    error.statusCode = 403;
    throw error;
  }

  const matchStage = {
    theatre: theatre._id,
    status: "BOOKED"
  }

  
  // Filter by Date Range (e.g., ?startDate=2024-01-01&endDate=2024-01-31)
  if(filters.startDate || filters.endDate){
    matchStage.createdAt = {};
    if(filters.startDate) matchStage.createdAt.$gte = new Date(filters.startDate);
    if(filters.endDate) matchStage.createdAt.$lte = new Date(filters.endDate);
  }

  // Filter by Movie ?movie=ID
  if(filters.movie){
    matchStage.movie = new mongoose.Types.ObjectId(filters.movie);
  }

  const stats = await Booking.aggregate([
    {
      $match: matchStage
    },
    {
      $group: {
        _id: "$theatre",
        totalRevenue: {$sum: "$totalCost"},
        ticketCount: {$sum: "$noOfSeats"}
      }
    }
  ]);


  return {
    revenue: stats[0]?.totalRevenue || 0,
    totalTickets: stats[0]?.ticketCount || 0,
    theatreName: theatre.name
  };

}

const getTotalRevenueTheatre = async (ownerId) => {
  const myTheatres = await Theatre.find({owner: ownerId, isApproved: true}).select('_id');
  const theatreIds = myTheatres.map(t => t._id);

  if(theatreIds.length === 0) return {totalRevenue: 0, theatreCount: 0}; 

  const stats = await Booking.aggregate([
    {
      $match : {
        theatre: {$in: theatreIds},
        status: "BOOKED"
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: {$sum: "$totalCost"},
        totalTicketsSold: {$sum: "$noOfSeats"},
        theatreCount: {$addToSet: "$theatre"}
      }
    },
    {
      $project: {
        _id: 0,
        totalRevenue: 1,
        totalTicketsSold: 1,
        activeTheatresCount: {$size: "$theatreCount"}
      }
    }
  ])

  return stats.length > 0 ? stats[0] : { totalRevenue: 0, totalTicketsSold: 0, activeTheatresCount: 0 };
}

const getRevenuePerMovie = async(theatreId, ownerId) => {
  const theatre = await Theatre.findById(theatreId);
  if(!theatre) {
    const error = new Error('Theatre not found');
    error.statusCode = 404;
    throw error;
  }

  if(!theatre.owner.equals(ownerId)){
    const error = new Error('You are not the owner of this theatre');
    error.statusCode = 404;
    throw error;
  }

  if(!theatre.isApproved){
    const error = new Error("Theatre is not approved");
    error.statusCode = 403;
    throw error;
  }

  const stats = await Booking.aggregate([
    {
      $match: {
        theatre: theatre._id,
        status: "BOOKED"
      }
    },
    {
      $group: {
        _id: "$movie",
        totalRevenue: {$sum: "$totalCost"},
        ticketCount: {$sum: "$noOfSeats"}
      }
    },

    {
      $lookup : {
        from: "movies",
        localField: "_id",
        foreignField: "_id",
        as: "movieData"
      }
    },

    {$unwind: "$movieData"},

    {
      $project: {
        _id: 0,
        movieName: "$movieData.name",
        revenue: "$totalRevenue",
        ticketSold: "$totalTickets"
      }
    },
    {$sort: {revenue: -1}}
  ]);

  return {
    revenue: stats[0]?.totalRevenue || 0,
    movieBreakdown: stats
  };
}

const verifyTicket = async (bookingId, ownerId) => {
  const booking = await Booking.findById(bookingId);

  if(!booking) {
    const error = new Error('Booking not found');
    error.statusCode = 404;
    throw error;
  }

  const theatre = await Theatre.findOne({ _id: booking.theatre, owner: ownerId, isApproved: true});

  if (!theatre) {
    const error = new Error('Unauthorized: This booking does not belong to your theatre or theatre is not approved.');
    error.statusCode = 403;
    throw error;
  }
  
  if(booking.status !== "BOOKED"){
    const error = new Error("Ticket in not booked || either Cancelled or Expired ");
    error.statusCode = 400;
    throw error;
  }

  if (booking.isCheckedIn) {
    throw Object.assign(new Error('Ticket already used/checked-in'), { statusCode: 400 });
  }

  const now = new Date();
  const showTime = new Date(booking.show.timings);

  const entryWindow = new Date(showTime.getTime() - 30 * 60000);

  if (now < entryWindow) {
    throw Object.assign(new Error('Entry not allowed yet. Please wait for the entry window.'), { statusCode: 400 });
  }

  booking.isCheckedIn = true;
  await booking.save();

  return booking;
}

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking
}

module.exports = {
  getAllBookingOfOwnTheatre,
  getBookingById,
  getTotalRevenue,
  getRevenuePerMovie,
  getTotalRevenueTheatre,
  verifyTicket
}