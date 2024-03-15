const express = require('express');
const User = require('../models/user.js');
const userotpVerfication = require('../models/userotpverfication.js');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post("/entermail", async (req, res) => {
    try {
        const email = req.body.email;

        // Check if a verified user with the given email exists
        const user = await User.findOne({ email: email, isVerified: true });
        if (!user) {
            return res.status(404).json({
                statusText: "Not Found",
                message: "No verified user found with this email address.",
            });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiration = new Date(Date.now() + 600000); // OTP expires in 10 minutes

        // Save OTP to the database
        const userOtpVerification = new userotpVerfication({
            userID: user._id,
            otp: otp,
            createdAt: new Date(),
            expiresAt: otpExpiration,
        });
        await userOtpVerification.save();

        // Send OTP via email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP to reset your password is ${otp}. It expires in 10 minutes.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                res.status(500).send("An unexpected error occurred while sending the email.");
            } else {
                console.log("Email sent:", info.response);
                res.status(200).json({
                    statusText: "Success",
                    message: "OTP sent to your email. Please check your inbox.",
                });
            }
        });
    } catch (err) {
        console.error("Error in forget password:", err);
        res.status(500).send("An unexpected error occurred.");
    }
});

router.post("/changepassword", async (req, res) => {
    try {
        const { email, otp, newPassword, confirmPassword } = req.body;

        // Find the user in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                statusText: "Not Found",
                message: "User not found.",
            });
        }

        // Find the OTP for the user
        const userOtpVerification = await userotpVerfication.findOne({
            userID: user._id,
            otp,
            expiresAt: { $gt: new Date() },
        });

        if (!userOtpVerification) {
            return res.status(400).json({
                statusText: "Bad Request",
                message: "Invalid OTP.",
            });
        }

        // Check if new password and confirm password match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                statusText: "Bad Request",
                message: "Passwords do not match.",
            });
        }

        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update user's password in the database
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            statusText: "Success",
            message: "Password updated successfully.",
        });
    } catch (err) {
        console.error("Error updating password:", err);
        res.status(500).send("An unexpected error occurred while updating password.");
    }
});

module.exports = router;
