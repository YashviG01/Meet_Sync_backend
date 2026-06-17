const express = require("express");

const router = express.Router();

const { signup,login, logout,getCurrentUser,forgotPassword,resetPassword,changePassword} = require("../controllers/authController");
const { signupValidation, loginValidation,} = require("../validations/authValidation");
const {changePasswordValidation} = require("../validations/changePasswordValidation");

const sendEmail=require("../utils/sendEmail")
const validate = require("../middlewares/validationMiddleware");
const {protectRoute} = require("../middlewares/authMiddleware");


router.post("/signup",  signupValidation, validate, signup);
router.post("/login", loginValidation, validate, login);
router.post("/logout",  logout);








router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);
router.post("/change-password",protectRoute, changePasswordValidation ,changePassword);

router.get("/me", protectRoute, getCurrentUser);
module.exports = router;
