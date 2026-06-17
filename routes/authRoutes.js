const express = require("express");

const router = express.Router();

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const protectRoute = require("../middleware/authMiddleware");

router.post("/signup", signup);

router.post("/login", login);
router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);
router.get("/me", protect, getCurrentUser);
module.exports = router;
