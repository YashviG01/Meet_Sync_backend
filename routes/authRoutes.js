const express = require("express");

const router = express.Router();

const { signup,login, logout,getCurrentUser,forgotPassword,resetPassword} = require("../controllers/authController");
const { signupValidation, loginValidation,} = require("../validations/authValidation");

const validate = require("../middlewares/validationMiddleware");
const {protectRoute} = require("../middlewares/authMiddleware");
console.log(signup)
// console.log({
//   signup: typeof signup,
//   login: typeof login,
//   logout: typeof logout,
//   getCurrentUser: typeof getCurrentUser,
//   forgotPassword: typeof forgotPassword,
//   resetPassword: typeof resetPassword,

//   signupValidation: typeof signupValidation,
//   loginValidation: typeof loginValidation,

//   validate: typeof validate,
//   protectRoute: typeof protectRoute,
// });

console.log("invoking signup")
router.post("/signup",  (req, res, next) => {
  console.log("ROUTE HIT: signup");
  next();},signupValidation, validate, signup);
console.log("after invoking signup")
router.post("/login", loginValidation, validate, login);
router.post("/logout",  logout);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);
// router.post("/change-password/:token",protectRoute, changePassword);

router.get("/me", protectRoute, getCurrentUser);
module.exports = router;
