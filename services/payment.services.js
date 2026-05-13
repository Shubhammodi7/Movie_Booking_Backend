const {processFakePayment} = require('../utils/processFakePayment');
const Payment = require('../models/payment.model');
const Booking = require('../models/booking.model');
const Show = require('../models/show.model')

const verifyPayment = async (userId, bookingId, amount, paymentMethod) => {
  const booking = await Booking.findById(bookingId);


  if(!booking) {
    const error = new Error('Invalid Booking Id');
    error.statusCode = 404;
    throw error;
  }

  if(booking.user != userId){
    const error = new Error('Not Your Booking Id');
    error.statusCode = 404;
    throw error;
  }

  const paymentResult = await processFakePayment(bookingId, amount);

  const payment = await Payment.create({
    booking: bookingId,
    user: userId,
    transactionId: paymentResult.transactionId,
    paymentMethod: paymentMethod,
    amount: amount,
    status: paymentResult.status
  })

  if (paymentResult.status === 'SUCCESS') {
    booking.status = 'BOOKED';
    await booking.save();
  } else {
    // If payment failed, we release the seats back to the theatre!
    const booking = await Booking.findById(bookingId);
    await Show.findByIdAndUpdate(booking.show, {
      $inc: { availableSeats: booking.noOfSeats }
    });
    booking.status = 'CANCELLED';
    await booking.save();
  }

  const message = paymentResult.message

  return {payment,message};
}

module.exports = {
  verifyPayment
}