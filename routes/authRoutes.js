const express = require("express");

const router = express.Router();

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const {
  signupValidation,
  loginValidation,
} = require("../validations/authValidation");

const validate = require(
  "../middlewares/validationMiddleware"
);
const protectRoute = require("../middleware/authMiddleware");

router.post("/signup", signupValidation,validate,signup);

router.post("/login",loginValidation,validate, login);
router.post("/logout",protectRoute, logout);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);
router.post("/change-password/:token",protectRoute, changePassword);

router.get("/me", protectRoute, getCurrentUser);
module.exports = router;
