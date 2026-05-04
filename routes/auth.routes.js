const express = require('express');
const router = express.Router();
const {registerUser, loginUser, logoutUser, seeProfile, updateUser, getAllUsers, getUserById, toggleTheatreById, getPendingTheatres} = require('../controllers/auth.controller');
const {registerUserSchema, loginUserSchema} = require('../validators/auth.validator');
const validate = require('../middlewares/validator.middleware');
const {isLoggedIn, isAdmin, isAppUser, isTheatreOwner} = require('../middlewares/auth.middleware')

router.post('/register', validate(registerUserSchema), registerUser);

router.post('/login', validate(loginUserSchema), loginUser);

router.post('/logout', logoutUser)

router.get('/getprofile', isLoggedIn, seeProfile);

router.patch('/update', isLoggedIn, updateUser)



// --------- ADMIN ROUTES ------------
router.get('/admin/users', isLoggedIn, isAdmin, getAllUsers);

router.get('/admin/users/:id', isLoggedIn, isAdmin, getUserById);

router.get('/admin/theatres/pending', isLoggedIn, isAdmin, getPendingTheatres)

router.patch('/admin/theatres/:id/toggle', isLoggedIn, isAdmin, toggleTheatreById);






module.exports = router;