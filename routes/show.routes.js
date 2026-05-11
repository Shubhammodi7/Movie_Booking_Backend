const express = require('express');
const router = express.Router();
const {validate} = require('../middlewares/movie.middleware');
const {showCreateSchema, showUpdateSchema} = require('../validators/show.validator');
const {createShow, getShows, getShowByTheatreId, getShowByTheatreName, getShowByMovieName, getShowById, updateShowById, deleteShowById} = require('../controllers/show.controller');
const {paginate} = require('../middlewares/pagination.middleware')
const {isLoggedIn, canManageShow} = require('../middlewares/auth.middleware')


// -------- ADMIN ROUTES ----------

//router: POST /mba/api/v1/show
router.post('/show', isLoggedIn, canManageShow, validate(showCreateSchema), createShow);

//router: PATCH /mba/api/v1/show
router.patch('/show/:id', isLoggedIn, canManageShow, validate(showUpdateSchema), updateShowById)

//router: DELETE /mba/api/v1/show
router.delete('/show/:id', isLoggedIn, canManageShow, deleteShowById)



// ---------- USER ROUTES ---------

//router: GET /mba/api/v1/:city/show
router.get('/:city/show', paginate(10), getShows);

//router: GET /mba/api/v1/show/theatre/:id
router.get('/show/theatre/:id', paginate(10), getShowByTheatreId);

//router: GET /mba/api/v1/:city/show/theatre/:theatreName
router.get('/:city/show/theatre/:name', paginate(10), getShowByTheatreName);

//router: GET /mba/api/v1/:city/show/movie/:movieName
router.get('/:city/show/movie/:name', paginate(10), getShowByMovieName);

//router: GET /mba/api/v1/show/:showId
router.get('/show/:showId', paginate(10), getShowById);

module.exports = router;
