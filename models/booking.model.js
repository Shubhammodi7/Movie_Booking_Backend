const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: true
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  },
  theatre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theatre'
  },
  noOfSeats: {
    type: Number,
    required: true
  },
  totalCost: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["PENDING", "BOOKED", "CANCELLED", "EXPIRED"],
    default: "PENDING"
  },
  paymentId: {
    type: String,
    default: null
  },
  isCheckedIn: {
    type: Boolean,
    default: false
  }
}, {timestamps: true})

module.exports = mongoose.model('Booking', bookingSchema)