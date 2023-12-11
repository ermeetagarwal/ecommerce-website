const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to  User model
    required: true,
  },
  items: [],
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
