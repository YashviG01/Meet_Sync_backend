const jwt = require("jsonwebtoken");

/**
 * Generate JWT Token
 * @param {String} userId - MongoDB User ID
 * @returns {String} token
 */
const generateToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

module.exports = generateToken;