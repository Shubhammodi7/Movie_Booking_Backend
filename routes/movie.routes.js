const express = require('express');
const router = express.Router();
const {createMovie, getMovieById, getMovieByName, deleteMovie, updateMovie} = require('../controllers/movie.controller')
const {movieCreateSchema, movieUpdateSchema} = require('../validators/movie.validator')
const {validate} = require('../middlewares/movie.middleware');
const {isLoggedIn, isAdmin, isTheatreOwner} = require('../middlewares/auth.middleware')


//router: POST /mba/api/v1/movies
router.post('/movies', isLoggedIn, isAdmin, validate(movieCreateSchema), createMovie);

//router: GET /mba/api/v1/movies
router.get('/movies', getMovieByName);

//router: GET /mba/api/v1/movies/:id
router.get('/movies/:id', getMovieById);

//router: DELETE /mba/api/v1/movies/:id
router.delete('/movies/:id', isLoggedIn, isAdmin, deleteMovie);

//router: PATCH /mba/api/v1/movies/:id
router.patch('/movies/:id', isLoggedIn, isAdmin, validate(movieUpdateSchema), updateMovie);





module.exports = router;