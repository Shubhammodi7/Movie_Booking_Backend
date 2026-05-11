const express = require('express');
const router = express.Router();
const {registerUser, loginUser, logoutUser, seeProfile, updateUser, getAllUsers, getUserById, toggleTheatreById, getPendingTheatres} = require('../controllers/auth.controller');
const {registerUserSchema, loginUserSchema} = require('../validators/auth.validator');
const validate = require('../middlewares/validator.middleware');
const {isLoggedIn, isAdmin, isAppUser, isTheatreOwner} = require('../middlewares/auth.middleware')

// PUBLIC
router.post('/register', validate(registerUserSchema), registerUser);
router.post('/login', validate(loginUserSchema), loginUser);
router.post('/logout', logoutUser);

// AUTHENTICATED USER
router.get('/profile', isLoggedIn, seeProfile);
router.patch('/profile/update', isLoggedIn, updateUser);

// ADMIN
router.get('/admin/users', isLoggedIn, isAdmin, getAllUsers);
router.get('/admin/users/:id', isLoggedIn, isAdmin, getUserById);
router.get('/admin/theatres/pending', isLoggedIn, isAdmin, getPendingTheatres);
router.patch('/admin/theatres/:id/toggle', isLoggedIn, isAdmin, toggleTheatreById);





module.exports = router;