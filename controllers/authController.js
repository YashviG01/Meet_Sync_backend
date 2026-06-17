const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
//signup
exports.signup = async (req, res, next) => {
  try {
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
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.login = async (req, res, next) => {
  try {
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
exports.logout = async (req, res, next) => {
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
exports.getCurrentUser = async (req, res, next) => {
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

exports.forgotPassword = async (
    req,
    res,
    next
) => {
    try {

        const { email } = req.body;

        const user =
            await User.findOne({ email });

        // Security:
        // Don't reveal whether user exists

        if (!user) {
            return res.status(200).json({
                success:true,
                message:
                "If an account exists, a reset email has been sent."
            });
        }

        const resetToken =
            crypto.randomBytes(32)
            .toString("hex");

        const hashedToken =
            crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordToken =
            hashedToken;

        user.resetPasswordExpires =
            Date.now() +
            15 * 60 * 1000; // 15 min

        await user.save();

        // Email Link

        const resetUrl =
        `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        // sendEmail(...)
        // implement later

        return res.status(200).json({
            success:true,
            message:
            "Password reset email sent"
        });

    } catch(error){
        next(error);
    }
};
// resetPassword
exports.resetPassword = async (
    req,
    res,
    next
)=>{
    try{

        const { password } = req.body;

        const resetToken =
            req.params.token;

        const hashedToken =
            crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        const user =
        await User.findOne({
            resetPasswordToken:
                hashedToken,

            resetPasswordExpires:
            {
                $gt: Date.now()
            }
        });

        if(!user){
            return res.status(400).json({
                success:false,
                message:
                "Invalid or expired reset token"
            });
        }

        const hashedPassword =
        await bcrypt.hash(
            password,
            10
        );

        user.password =
            hashedPassword;

        user.resetPasswordToken =
            undefined;

        user.resetPasswordExpires =
            undefined;

        await user.save();

        return res.status(200).json({
            success:true,
            message:
            "Password reset successful"
        });

    }catch(error){
        next(error);
    }
};// verifyEmail

// refreshToken

// changePassword

exports.changePassword = async (
    req,
    res,
    next
)=>{
    try{

        const {
            currentPassword,
            newPassword
        } = req.body;

        const user =
        await User.findById(
            req.user._id
        );

        const isMatch =
        await bcrypt.compare(
            currentPassword,
            user.password
        );

        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:
                "Current password is incorrect"
            });
        }

        const samePassword =
        await bcrypt.compare(
            newPassword,
            user.password
        );

        if(samePassword){
            return res.status(400).json({
                success:false,
                message:
                "New password must be different from current password"
            });
        }

        const hashedPassword =
        await bcrypt.hash(
            newPassword,
            10
        );

        user.password =
            hashedPassword;

        await user.save();

        return res.status(200).json({
            success:true,
            message:
            "Password changed successfully"
        });

    }catch(error){
        next(error);
    }
};
