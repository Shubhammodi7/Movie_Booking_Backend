const express = require('express');
const router = express.Router();
const {createMovie, getMovieById, getMovieByName, deleteMovie, updateMovie} = require('../controllers/movie.controller')
const {movieCreateSchema, movieUpdateSchema} = require('../validators/movie.validator')
const {validate} = require('../middlewares/movie.middleware');


//router: POST /mba/api/v1/movies
router.post('/movies', validate(movieCreateSchema), createMovie);

//router: GET /mba/api/v1/movies
router.get('/movies', getMovieByName);

//router: GET /mba/api/v1/movies/:id
router.get('/movies/:id', getMovieById);

//router: DELETE /mba/api/v1/movies/:id
router.delete('/movies/:id', deleteMovie);

//router: PATCH /mba/api/v1/movies/:id
router.patch('/movies/:id', validate(movieUpdateSchema), updateMovie);





module.exports = router;