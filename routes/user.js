const express = require("express");
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { authenticateToken, authenticateAdminToken } = require("../middleware/index.js");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email.toLowerCase() });
    if (existingUser && !existingUser.isVerified) {
      await User.findOneAndDelete({ email: req.body.email.toLowerCase() });
    }

    if (existingUser) {
      return res.status(409).json({
        statusText: "Conflict",
        message: "Email already exists. Please use a different email.",
      });
    }

    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email.toLowerCase(),
      phoneNumber: req.body.phoneNumber,
      isVerified: false, // Added isVerified field
      otp: null, // Added otp field
      otpExpiresAt: null, // Added otpExpiresAt field
    });

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    newUser.password = hashedPassword;

    await newUser.save();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiration = new Date(Date.now() + 600000); // OTP expires in 10 minutes
    newUser.otp = otp;
    newUser.otpExpiresAt = otpExpiration;
    await newUser.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.body.email,
      subject: "OTP for registration",
      text: `Your OTP for registration is ${otp}. It expires in 10 minutes.`,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error("Error sending OTP:", error);
        await newUser.remove(); // Delete the user if sending OTP fails
        return res.status(500).send("An unexpected error occurred while sending OTP.");
      } else {
        console.log("OTP sent:", info.response);
        const token = jwt.sign({ userId: newUser._id }, process.env.SECRET, {});
    
        res.status(201).json({
          statusText: "Success",
          message: "User registered successfully. Check your email for OTP.",
          token: token,
        });
      }
    });
  } catch (err) {
    console.error("User registration error:", err);
    res.status(500).send("An unexpected error occurred during registration.");
  }
});


router.get("/",authenticateAdminToken, async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.status(200).json({
      statusText: "Success",
      users: users,
    });
  } catch (err) {
    console.error("Error getting users:", err);
    res.status(500).send("An unexpected error occurred while fetching users.");
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        statusText: "Unauthorized",
        message: "User not found or Email not found. Please register.",
      });
    }

    if (!user.isVerified) {
      await User.findOneAndDelete({ email: req.body.email.toLowerCase() });
      return res.status(401).json({
        statusText: "Unauthorized",
        message: "User email is not verified. User deleted from the database.",
      });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        statusText: "Unauthorized",
        message: "Incorrect password.",
      });
    }

    const token = jwt.sign({ userId: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, phoneNumber: user.phoneNumber }, process.env.SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      statusText: "Success",
      message: "User successfully logged in.",
      token: token,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).send("An unexpected error occurred.");
  }
});


router.post("/verify-otp", async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const otp = req.body.otp;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        statusText: "Not Found",
        message: "User not found.",
      });
    }

    if (user.otp !== otp || user.otpExpiresAt < new Date()) {
      // OTP expired
      if (!user.isVerified) {
        // If user is not verified, delete the user
        await User.deleteOne({ _id: user._id });
        return res.status(400).json({
          statusText: "Bad Request",
          message: "OTP has expired. User deleted.",
        });
      } else {
        return res.status(400).json({
          statusText: "Bad Request",
          message: "Invalid OTP.",
        });
      }
    }

    // Update user's verification status 
    user.isVerified = true;
    user.otp = null; // Clear OTP
    user.otpExpiresAt = null; // Clear OTP expiration
    await user.save();

    res.status(200).json({
      statusText: "Success",
      message: "OTP verified successfully.",
    });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).send("An unexpected error occurred while verifying OTP.");
  }
});
module.exports = router;
