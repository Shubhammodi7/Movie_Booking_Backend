const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if(!result.success){
    const errorMessages = result.error.issues.map(issue => `${issue.path.join('.')} : ${issue.message}`);

    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      err: errorMessages
    })
  }

    req.body = result.data;
    next();
}

module.exports = {validate};