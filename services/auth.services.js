const User = require('../models/auth.model');
const Theatre = require('../models/theatre.model');
const jwt = require('jsonwebtoken')
const dotenvResult = require('dotenv').config()
const { JWT_SECRET, JWT_EXPIRES_IN } = dotenvResult.parsed || {}

const registerUser = async (userData) => {
  const user = await User.create(userData);

  if(user.role === 'theatreOwner') {
    user.ownedTheatres = [];

    if(userData.ownedTheatres === undefined || !Array.isArray(userData.ownedTheatres)) {
      throw new Error('Owned theatres must be an array of theatre IDs and cannot be empty for theatre owners');
    }

    user.ownedTheatres = userData.ownedTheatres;
    await user.save();
  }

  if(user.role === 'admin'){
    const admin = await User.findOne({role: 'admin'});

    if(admin){
      throw new Error('Admin already exists');
    }
  }

  const token = jwt.sign({_id: user._id, role: user.role}, JWT_SECRET, {expiresIn: '3d'})

  console.log("Generated JWT Token:", token);

  const userResponse = user.toObject();
  delete userResponse.password;

  return { user: userResponse, token };
}

const loginUser = async (email, password) => {
    const user = await User.findOne({email}).select('+password');
    if(!user) {
      throw new Error('User not found');
    }

    const isMatch = await user.comparePassword(password);
    if(!isMatch) {
      throw new Error('Invalid Credentials');
    }

    const newToken = jwt.sign({_id: user._id, role: user.role}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN || '3d'});

    const userResponse = user.toObject();
    delete userResponse.password;
    

    return {user: userResponse, token: newToken}
}

const seeProfile = async (token) => {
  const decoded = jwt.verify(token, JWT_SECRET);

  const user = await User.findById(decoded._id);

  if(!user){
    throw new Error('User not found');
  }

  return user;
}

const updateUser = async (updatedData, id) => {
  const user = await User.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true
  });

  if(!user) {
    throw new Error("You're not logged-in");
  }

  return user;
}


// ---------- ADMIN SERVICES --------------

const getAllUsers = async () => {
  const users = await User.find({role: {$ne: 'admin'}}).select('name email role ownedTheatres');

  const formattedUsers = users.map(user => {
    const userObj = user.toObject();

    if(userObj.role !== 'theatreOwner'){
      delete userObj.ownedTheatres
    }

    return userObj;
  })

  return formattedUsers;
}

const getUserById = async (id) => {
  const user = await User.findById(id).select('name email role ownedTheatres')

  if(!user) {
    throw new Error("User doesn't exist")
  }

  if(user.role !== 'theatreOwner'){
    delete user.ownedTheatres
  }

  return user;
}

const toggleTheatreById = async (id) => {
  const theatre = await Theatre.findById(id);

  if(!theatre) throw new Error('No Theatre  is found by this id')

  theatre.isApproved = !theatre.isApproved;
  const response = await theatre.save();

  return response;
}

const getPendingTheatres = async () => {
  const theatres = await Theatre.find({isApproved: false}).select('-movies')

  return theatres;
}

module.exports = {registerUser, loginUser, seeProfile, updateUser, getAllUsers, getUserById, toggleTheatreById, getPendingTheatres};