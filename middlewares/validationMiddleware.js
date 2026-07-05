const { validationResult } =
  require("express-validator");

const validate = (req, res, next) => {
  console.log("join middleware called")
  const errors =
    validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
};

module.exports = validate;