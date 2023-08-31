import express from "express";
import mongoose from "mongoose";
import User from "../models/user.js";
import passport from "passport";

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
        await User.register(newUser, req.body.password);

        passport.authenticate("local")(req, res, () => {
          res.status(200).json({
            statusText: "Success",
            message: "User registered successfully and logged in.",
          });
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
    const user = new User({
      email: req.body.email,
      password: req.body.password,
    });
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
