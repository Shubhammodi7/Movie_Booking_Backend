const Booking = require('../models/booking.model')

const processFakePayment = async (bookingId, amount) => {
  await new Promise(resolve => setTimeout(resolve, 2000));

  const booking = await Booking.findById(bookingId);

  const isSuccess = Math.random() > 0.01;

  if(!isSuccess || amount < booking.totalCost) {
    return {
      status: "FAILED",
      transactionId: `TXN_FAIL_${Date.now()}_${bookingId.slice(-4)}`,
      message: "Payment Rejected By Bank"
    }
  }

  return {
    status: "SUCCESS",
    transactionId: `TXN_SUCCESS_${Date.now()}_${bookingId.slice(-4)}`,
    message: "Payment Accepted By Bank"
  };
};

module.exports = {
  processFakePayment
}