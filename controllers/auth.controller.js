const authService = require('../services/auth.services');
const {successBody, errorBody} = require('../utils/response')

const registerUser = async (req, res) => {
  try {
    const response = await authService.registerUser(req.body);
    
    res.cookie('token', response.token);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: response
    });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message
    });
  }
}

const loginUser = async (req, res) => {
  try {
    const {email, password} = req.body;

    const response = await authService.loginUser(email, password);

    res.cookie('token', response.token, {
      httpOnly: true,
      maxAge: 3*24*60*60*1000
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: response
    })
  } catch (error) {
    const status = error.statusCode || 500
    return res.status(status).json({
      success: false,
      message: error.message
    })
  }
}

const logoutUser = (req, res) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true
  });

  return res.status(200).json({
    success: true,
    message: "User logged out successfully"
  })
}

const seeProfile = async (req, res) => {
  try {
    const response = await authService.seeProfile(req.cookies.token);

    return res.status(200).json({
      success: true,
      message: "User Profile fetched successfully",
      data: response
    })
  } catch (error) {
    const status = error.statusCode || 500
    return res.status(status).json({
      success: false,
      message: error.message
    })
  }
}

const updateUser = async (req, res) => {
  try {
    const response = await authService.updateUser(req.body, req.user._id);

    return res.status(200).json(successBody(response, "Successfully updated"))
  } catch (error) {
    const status = error.statusCode || 500
    return res.status(status).json(errorBody(error, error.message));
  }
}


// -------------- ADMIN CONTROLLERS ---------------
const getAllUsers = async (req, res) => {
  const response = await authService.getAllUsers();

  return res.status(200).json({
    totalUsers: response.length,
    data: response
  })
}

const getUserById = async (req, res) => {
  try {
    const {id} = req.params;
    const response = await authService.getUserById(id);

    return res.status(200).json(successBody(response, "User data fetched"))

  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json(errorBody(error, error.message))
  }
}

const toggleTheatreById = async (req, res) => {
  try {
    const {id} = req.params;
    const response = await authService.toggleTheatreById(id);

    return res.status(202).json(successBody(response, "Successfully toggled the value"))
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json(errorBody(error, error.message))
  }
}

const getPendingTheatres = async (req, res) => {
  try {
    const response = await authService.getPendingTheatres();

    if(response.length === 0){
      return res.status(400).json({message: "No Pending Theatres"});
    }

    return res.status(200).json({
    totalPendingTheatres: response.length,
    data: response
  })
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json(errorBody(error, error.message))
  }
}






module.exports = {registerUser, loginUser, logoutUser, seeProfile, updateUser, getAllUsers, getUserById, toggleTheatreById, getPendingTheatres}