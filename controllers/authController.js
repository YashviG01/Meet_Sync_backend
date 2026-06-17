const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

//signup
const signup = async (req, res, next) => {
  try {
    console.log("signup invoked");
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    //user exists already
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }
    // if nnot
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    //gen token
    const token = generateToken(user._id);
    //set in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

//login

const login = async (req, res, next) => {
  try {
    console.log("login invoked");
    let { email, password } = req.body;

    email = email.trim().toLowerCase();

    // Find user
    const user = await User.findOne({ email });

    // User not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    // Wrong password
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = generateToken(user._id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

//logout
const logout = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
//getCurrentUser
const getCurrentUser = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};
//forgotPassword

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Security:
    // Don't reveal whether user exists

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account exists, a reset email has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    console.log("token", resetToken);

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;

    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min

    await user.save();

    // Email Link

    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5000"}/reset-password/${resetToken}`;

    // sendEmail

    try {
      await sendEmail({
        to: user.email,

        subject: "Password Reset",

        html: `
    <h2>Password Reset Request</h2>

    <p>
      Click the link below to reset your password:
    </p>

    <a href="${resetUrl}">
      Reset Password
    </a>

    <p>
      This link expires in 15 minutes.
    </p>
  `,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return res.status(500).json({
        success: false,
        message: "Email could not be sent",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    next(error);
  }
};
// resetPassword
const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    const resetToken = req.params.token;

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,

      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    const samePassword = await bcrypt.compare(password, user.password);

    if (samePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different",
      });
    }

    user.resetPasswordToken = undefined;

    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (
  req,
  res,
  next
) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isMatch =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message:
          "Current password is incorrect",
      });
    }

    // Prevent password reuse
    const samePassword =
      await bcrypt.compare(
        newPassword,
        user.password
      );

    if (samePassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from current password",
      });
    }

    // Hash new password
    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    user.password =
      hashedPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password changed successfully",
    });

  } catch (error) {

    console.error(
      "Error in changePassword controller:",
      {
        message: error.message,
        name: error.name,
        stack: error.stack,
        userId: req.user?._id,
      }
    );

    // Database related errors
    if (
      error.name === "MongoServerError" ||
      error.name === "MongooseError"
    ) {
      return res.status(500).json({
        success: false,
        message:
          "Database error while changing password",
      });
    }

    // Bcrypt related errors
    if (
      error.message?.includes("bcrypt")
    ) {
      return res.status(500).json({
        success: false,
        message:
          "Password encryption failed",
      });
    }

    // Pass unknown errors to global handler
    next(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  changePassword
};

// verifyEmail

// refreshToken

// changePassword
// exports.changePassword = async (
//     req,
//     res,
//     next
// )=>{
//     try{

//         const {
//             currentPassword,
//             newPassword
//         } = req.body;

//         const user =
//         await User.findById(
//             req.user._id
//         );

//         const isMatch =
//         await bcrypt.compare(
//             currentPassword,
//             user.password
//         );

//         if(!isMatch){
//             return res.status(400).json({
//                 success:false,
//                 message:
//                 "Current password is incorrect"
//             });
//         }

//         const samePassword =
//         await bcrypt.compare(
//             newPassword,
//             user.password
//         );

//         if(samePassword){
//             return res.status(400).json({
//                 success:false,
//                 message:
//                 "New password must be different from current password"
//             });
//         }

//         const hashedPassword =
//         await bcrypt.hash(
//             newPassword,
//             10
//         );

//         user.password =
//             hashedPassword;

//         await user.save();

//         return res.status(200).json({
//             success:true,
//             message:
//             "Password changed successfully"
//         });

//     }catch(error){
//         next(error);
//     }
// };
