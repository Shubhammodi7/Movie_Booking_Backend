const isRightTheatreOwner = async (req, res, next) => {
  try {
    if(req.user.role  === 'admin'){
    return next();
  }

  const theatreId = req.params.id;
  const isOwner = req.user.ownedTheatres.some(
    (id) => id.toString() === theatreId
  );

  if(!isOwner) {
    return res.status(403).json({
      success: false,
      message: "Ownership Mismatch: You do not have access to this theatre"
    })
  }

  next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {isRightTheatreOwner}