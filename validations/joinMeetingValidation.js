const { param } = require("express-validator");

  
const joinMeetingValidation = [
  param("meetingId")
    .trim()
    .notEmpty()
    .withMessage("Meeting ID is required")
    .isLength({ min: 6 })
    .withMessage("Invalid meeting ID"),
];

module.exports = {
  joinMeetingValidation,
};