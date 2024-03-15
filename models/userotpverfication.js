const mongoose = require("mongoose");
const userotpschema = mongoose.Schema({
    userID:String,
    otp:String,
    createdAt: Date,
    expiresAt: Date,
});

const userotpVerfication = mongoose.model(
    "userotpVerfication",
    userotpschema
);
module.exports = userotpVerfication;