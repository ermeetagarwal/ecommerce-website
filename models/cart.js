const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User model
    required: true,
  },
  items: [],
  discountFromCode: {
    type: Number,
    default: 0, // Default value is 0
  },
  total: {
    type: Number,
    default: 0, // Default value is 0
  },
});
