const paymentService = require('../services/payment.services');
const { successBody, errorBody } = require('../utils/response');

const verifyPayment = async (req, res) => {
  try {
    const {booking, amount, paymentMethod} = req.body;

    const response = await paymentService.verifyPayment(req.user.id, booking, amount, paymentMethod);

    return res.status(200).json(successBody(response.payment, response.message));
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json(errorBody(error, error.message));
  }
}

module.exports = {
  verifyPayment
}