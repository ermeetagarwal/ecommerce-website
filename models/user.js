const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: Number, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
