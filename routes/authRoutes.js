const express = require("express");

const router = express.Router();

const { signup,login, logout,getCurrentUser,forgotPassword,resetPassword} = require("../controllers/authController");
const { signupValidation, loginValidation,} = require("../validations/authValidation");
const sendEmail=require("../utils/sendEmail")
const validate = require("../middlewares/validationMiddleware");
const {protectRoute} = require("../middlewares/authMiddleware");


router.post("/signup",  signupValidation, validate, signup);
router.post("/login", loginValidation, validate, login);
router.post("/logout",  logout);


//testing email utility

router.get(
  "/test-email",
  async (req, res) => {

    await sendEmail({
      to: "yashvigenius112@gmail.com",

      subject: "Testing Email",

      html: `
        <h1>Hello</h1>
        <p>Email service working.</p>
      `,
    });

    res.send("Email sent");
  }
);




router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);
// router.post("/change-password/:token",protectRoute, changePassword);

router.get("/me", protectRoute, getCurrentUser);
module.exports = router;
