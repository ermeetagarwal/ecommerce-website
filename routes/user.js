import express from "express";
import mongoose from "mongoose";
import User from "../models/user.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({
        statusText: "Conflict",
        message: "Email already exists. Please use a different email.",
      });
    } else {
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
      });
      try {
        // Hash the password before storing it
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        newUser.password = hashedPassword;

        await newUser.save();

        // Create a JWT token
        const token = jwt.sign({ userId: newUser._id }, process.env.SECRET , {
        });

        res.status(201).json({
          statusText: "Success",
          message: "User registered successfully ",
          token: token, // Include the token in the response
        });
      } catch (err) {
        console.error("User registration error:", err);
        res
          .status(500)
          .send("An unexpected error occurred during registration.");
      }
    }
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).send("An unexpected error occurred during registration.");
  }
});
router.post("/login", async (req, res) => {
  try {
    const use = await User.findOne({ email: req.body.email });
    if (!use) {
      return res.status(401).json({
        statusText: "Unauthorized",
        message: "User not found or Email not found. Please register.",
      });
    }
    // Check if the provided password is correct
    const isPasswordValid = await bcrypt.compare(req.body.password, use.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        statusText: "Unauthorized",
        message: "Incorrect password.",
      });
    }
    // Generate a JWT token for the authenticated user
    const token = jwt.sign({ userId: use._id, firstName: use.firstName,lastName: use.email, phoneNumber:use.phoneNumber, }, process.env.SECRET, {
      expiresIn: '1h', // You can adjust the expiration time
    });
    res.status(200).json({
      statusText: "Success",
      message: "User successfully logged in.",
      token: token, // Include the token in the response
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).send("An unexpected error occurred.");
  }
});

export default router;
