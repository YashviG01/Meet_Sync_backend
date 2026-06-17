const { body } = require("express-validator");

const createMeetingValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Meeting title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage(
      "Title must be between 3 and 100 characters"
    ),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage(
      "Description cannot exceed 500 characters"
    ),

  body("startTime")
    .notEmpty()
    .withMessage("Start time is required")
    .isISO8601()
    .withMessage("Invalid start time format"),

  body("endTime")
    .notEmpty()
    .withMessage("End time is required")
    .isISO8601()
    .withMessage("Invalid end time format")
    .custom((value, { req }) => {
      const start = new Date(req.body.startTime);
      const end = new Date(value);

      if (end <= start) {
        throw new Error(
          "End time must be after start time"
        );
      }

      return true;
    }),
];

module.exports = {
  createMeetingValidation,
};