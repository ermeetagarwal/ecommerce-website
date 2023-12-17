const express = require("express");
const router = express.Router();
const Cart = require("../models/cart.js");
const billingdetails = require("../models/checkout.js");
const authenticateToken = require("../middleware/index.js");

const generateOrderNumber = () => {
  const prefix = 'ORD';
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 100000);
  const orderNo = `${prefix}-${timestamp}-${random}`;
  return orderNo;
};

router.get("/billingdetails", async (req, res) => {
  try {
    const allBillingDetails = await billingdetails.find();
    res.json(allBillingDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/billingdetails", authenticateToken, async (req, res) => {
  const orderNo = generateOrderNumber();
  const date = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  try {
    const user = req.user;
    const userCart = await Cart.findOne({ user: user._id });

    // Create a new billing detail object
    const newBillingDetail = new billingdetails({
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      CompanyName: req.body.CompanyName,
      StreetAddress: req.body.StreetAddress,
      city: req.body.city,
      state: req.body.state,
      PinCode: req.body.PinCode,
      Phone: req.body.Phone,
      Email: req.body.Email,
      OrderNote: req.body.OrderNote,
      PaymentMethod: req.body.PaymentMethod,
      cart:userCart.toObject(), // Save the user's cart directly
      orderNo,
      date,
    });

    // Clear the user's cart
    userCart.items = [];
    await userCart.markModified('items');
    await userCart.save();

    // Save the new billing detail
    const savedBillingDetail = await newBillingDetail.save();
    res.status(201).json(savedBillingDetail);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
