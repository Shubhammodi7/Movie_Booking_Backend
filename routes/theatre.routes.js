const express = require('express');
const router = express.Router();

const {createTheatre, getAllTheatre, getTheatreById, updateTheatre, deleteTheatre} = require('../controllers/theatre.controller');

const {theatreCreateSchema} = require('../validators/theatre.validator.js');
const {validate} = require('../middlewares/movie.middleware')

//router: POST /mba/api/v1/theatre
router.post('/theatre', validate(theatreCreateSchema), createTheatre);

//router: GET /mba/api/v1/theatre
router.get('/theatre', getAllTheatre);

//router: GET /mba/api/v1/theatre/:id
router.get('/theatre/:id', getTheatreById);

//router: PATCH /mba/api/v1/theatre/:id
router.patch('/theatre/:id', updateTheatre);

//router: DELETE /mba/api/v1/theatre/:id
router.delete('/theatre/:id', deleteTheatre)



module.exports = router;