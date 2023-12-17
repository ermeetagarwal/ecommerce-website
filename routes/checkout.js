const express = require("express");
const router = express.Router();
const Cart = require("../models/cart.js");
const billingdetails = require("../models/checkout.js");
const authenticateToken = require("../middleware/index.js");

const generateOrderNumber = () => {
  const prefix = 'ORD'; // You can customize the prefix
  const timestamp = Date.now(); // Current timestamp
  const random = Math.floor(Math.random() * 100000); // Random number between 0 and 999

  // Concatenate the parts to form the order number
  const orderNo = `${prefix}-${timestamp}-${random}`;

  return orderNo;
};
// GET all billing details
router.get("/billingdetails", async (req, res) => {
  try {
    const allBillingDetails = await billingdetails.find();
    res.json(allBillingDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/billingdetails",authenticateToken, async (req, res) => {
  const orderNo = generateOrderNumber();
  const date = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
    const {
      FirstName,
      LastName,
      CompanyName,
      StreetAddress,
      city,
      state,
      PinCode,
      Phone,
      Email,
      OrderNote,
      PaymentMethod
    } = req.body;
    const user = req.user;
    const userCart = await Cart.findOne({ user: user._id });
    const yourorder = userCart;
    userCart.items = [];
    userCart.markModified('items');
    await userCart.save(); 
    const newBillingDetail = new billingdetails({
      FirstName,
      LastName,
      CompanyName,
      StreetAddress,
      city,
      state,
      PinCode,
      Phone,
      Email,
      OrderNote,
      PaymentMethod,
      yourorder,
      orderNo,
      date
    });
  
    try {
      const savedBillingDetail = await newBillingDetail.save();
      res.status(201).json(savedBillingDetail);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
module.exports = router;
