const express = require('express');
const router = express.Router();
const {validate} = require('../middlewares/movie.middleware');
const {paymentCreateSchema} = require('../validators/payment.validator');
const {isLoggedIn, isAdmin, isAppUser, isTheatreOwner} = require('../middlewares/auth.middleware')
const {verifyPayment} = require('../controllers/payment.controller');


// ----------- USER ROUTES ----------

router.post('/payment/verify', isLoggedIn, isAppUser, validate(paymentCreateSchema), verifyPayment);

module.exports = router;