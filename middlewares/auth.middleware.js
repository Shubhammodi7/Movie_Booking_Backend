const jwt = require('jsonwebtoken');
const User = require('../models/auth.model');
const dotenvResult = require('dotenv').config()
const { JWT_SECRET } = dotenvResult.parsed || {}

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if(!token){
      return res.status(401).json({
        success: false,
        message: "Please login to access this resource"
      });
    }
      const decoded = jwt.verify(token, JWT_SECRET);

      req.user = await User.findById(decoded._id).select('-password');

      if(!req.user){
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      next();

  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

// Check if the user is an Admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only."
    });
  }
};

// Check if the user is a Theatre Owner
const isTheatreOwner = (req, res, next) => {
  if (req.user && req.user.role === 'theatreOwner') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Theatre Owners only."
    });
  }
};

const canManageShow = (req, res, next) => {
  // Check if the user is an Admin OR a Theatre Owner
  if (req.user.role === 'admin' || req.user.role === 'theatreOwner') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only Admins or Theatre Owners can perform this action."
    });
  }
};


// Check if the user is a regular App User
const isAppUser = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Regular users only."
    });
  }
};

module.exports = { isLoggedIn, isAdmin, isTheatreOwner, isAppUser, canManageShow };