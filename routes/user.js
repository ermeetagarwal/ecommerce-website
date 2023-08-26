import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import passport from "passport";

const saltrounds = 10;
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const user = await User.register(
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
      },
      req.body.password
    );

    if (user) {
      // User registration successful, you might choose to log them in automatically
      passport.authenticate("local")(req, res, () => {
        // You can send a success response here if needed
        res.status(200).json({
          statusText: "Success",
          message: "User registered successfully and logged in.",
        });
      });
    }
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).send("An unexpected error occurred during registration.");
  }
});
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({
        statusText: "Unauthorized",
        message: "User not found. Please register.",
      });
    }

    // Use Passport's authenticate method
    req.login(user, async (err) => {
      if (err) {
        console.error("Authentication error:", err);
        return res
          .status(500)
          .send("An unexpected error occurred during login.");
      }

      // Authentication successful
      passport.authenticate("local")(req, res, () => {
        res.status(200).json({
          statusText: "Success",
          message: "User successfully logged in.",
        });
      });
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).send("An unexpected error occurred.");
  }
});

export default router;
