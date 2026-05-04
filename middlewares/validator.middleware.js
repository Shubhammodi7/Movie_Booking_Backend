// middleware/validator.middleware.js
const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      return next();
    } catch (e) {
      const errorDetails = e.errors 
        ? e.errors.map(err => `${err.path.join('.')} : ${err.message}`) 
        : [e.message];

      return res.status(400).json({
        success: false,
        message: "Validation Failed",
        err: errorDetails
      });
    }
  };
};

module.exports = validate;