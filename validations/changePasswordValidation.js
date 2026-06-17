const { body } = require("express-validator");

const changePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage(
      "Current password is required"
    ),

  body("newPassword")
    .notEmpty()
    .withMessage(
      "New password is required"
    )
    .isLength({ min: 8 })
    .withMessage(
      "Password must be at least 8 characters"
    )
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
    )
    .withMessage(
      "Password must contain uppercase, lowercase, number and special character"
    ),
];

module.exports = {
  changePasswordValidation
};