const express = require('express');
const router = express.Router();

const {createTheatre, getAllTheatre, getTheatreById, updateTheatre, deleteTheatre, getAllTheatreOfOwner} = require('../controllers/theatre.controller');

const {theatreCreateSchema} = require('../validators/theatre.validator.js');
const {validate} = require('../middlewares/movie.middleware')

const {isLoggedIn, isTheatreOwner} = require('../middlewares/auth.middleware.js')

const {isRightTheatreOwner} = require('../middlewares/ownership.middleware.js')

//router: POST /mba/api/v1/theatre
router.post('/theatre', isLoggedIn, isTheatreOwner, validate(theatreCreateSchema), createTheatre);

router.get('/theatre/mine', isLoggedIn, isTheatreOwner, getAllTheatreOfOwner);

//router: GET /mba/api/v1/theatre
router.get('/theatre', getAllTheatre);


//router: GET /mba/api/v1/theatre/:id
router.get('/theatre/:id', getTheatreById);


//router: PATCH /mba/api/v1/theatre/:id
router.patch('/theatre/:id', isLoggedIn, isRightTheatreOwner, updateTheatre);

//router: DELETE /mba/api/v1/theatre/:id
router.delete('/theatre/:id', isLoggedIn, isRightTheatreOwner, deleteTheatre);




module.exports = router;