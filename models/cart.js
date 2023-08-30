import mongoose from "mongoose";
import Product from "./Product.js";
import User from "./user.js"
const cartItemSchema = new mongoose.Schema({
  product: {
    type: String,
    ref: "Product", // Reference to  Product model
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to  User model
    required: true,
  },
  items: [cartItemSchema],
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
