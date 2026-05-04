const  theatreService = require('../services/theatre.services')
const {successBody, errorBody} = require('../utils/response');

const createTheatre = async (req, res) => {
  try {

    const response = await theatreService.createTheatre(req.body, req.user._id);

    return res.status(201).json(
      successBody(response, "New Movie Added")
    );

  } catch (error) {
    const status = error.statusCode || 500;
    console.log(error.message)
        
    return res.status(status).json(
      errorBody(error, error.message || "Internal server error")
    );
  }
}

const getAllTheatre = async (req, res) => {
  try {
    let query = {};
    if(req.query.name){
      query.name = {$regex: req.query.name, $options: 'i'};
    }
    if(req.query.pinCode){
      query.pinCode = Number(req.query.pinCode);
    }
    if(req.query.city){
      query.city = {$regex: req.query.city, $options: 'i'};
    }

    const response = await theatreService.getAllTheatre(query);

    if(response.length === 0){
      return res.status(404).json(errorBody("No movie found matching that criteria"));
    }

    return res.status(200).json(successBody(response, "Found Movies Successfully"));
  }
  catch(error) {
    const status = error.statusCode || 500;
    return res.status(status).json(errorBody(error.message));
  }
}

const getTheatreById = async (req, res) => {
  try {
    const response = await theatreService.getTheatreById(req.params.id);

    if(response.isApproved === false){
      return res.status(403).json({message: "This theatre is not approved by admin"})
    } 

    return res.status(200).json(successBody(response, "Found Movie Matching to ID"));
  } catch (error) {
    return res.status(500).json(errorBody(error, error.message));
  }
}

const updateTheatre = async (req, res) => {
  try {

    const response = await theatreService.updateTheatre(req.params.id, req.body);

    return res.status(200).json(successBody(response, "Updated the existing theatre"));
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json(errorBody(error, error.message));
  }
}

const deleteTheatre = async (req, res) => {
  try {
    const response = await theatreService.deleteTheatre(req.params.id);

    return res.status(200).json(successBody(response, `Deleted the existing theatre with given ID. Name was ${response.name}`));
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json(errorBody(error, error.message));
  }
}

const getAllTheatreOfOwner = async (req, res) => {
  try {
    const response = await theatreService.getAllTheatreOfOwner(req.user._id);


    return res.status(200).json({
      success: true,
      data: response,
      message: "Successfully fetch your theatres"
    })

  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Internal server error"
    })
  }
}

module.exports = {
  createTheatre,
  getAllTheatre,
  getTheatreById,
  updateTheatre,
  deleteTheatre,
  getAllTheatreOfOwner
}