const { param } = require("express-validator");

const meetingValidation = [
  param("meetingId")
    .trim()
    .notEmpty()
    .withMessage("Meeting ID is required"),
];

module.exports = {
  meetingValidation,
};