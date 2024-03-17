const express = require("express");
const router = express.Router();
const Cart = require("../models/cart.js");
const billingdetails = require("../models/checkout.js");
const authenticateToken = require("../middleware/index.js");
const nodemailer = require("nodemailer");
const generateOrderNumber = () => {
  const prefix = 'ORD';
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 100000);
  const orderNo = `${prefix}-${timestamp}-${random}`;
  return orderNo;
};

router.get("/billingdetailsforadmin", async (req, res) => {
  try {
    const allBillingDetails = await billingdetails.find();
    res.json(allBillingDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/billingdetails", authenticateToken, async (req, res) => {
  try {
    const user = req.user;

    // Find billing details for the specific user
    const userBillingDetails = await billingdetails.find({ "cart.user": user._id });
    res.json(userBillingDetails);
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
    const userCart = await Cart.findOne({ user: user._id.toString() });

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

    // Send a thank you email to the customer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: req.body.Email,
      subject: 'Thank you for your order!',
      html: `
        <h1>Thank you for your order!</h1>
        <p>Order Number: ${orderNo}</p>
        <p>Order Date: ${date}</p>
        <p>Name: ${req.body.FirstName} ${req.body.LastName}</p>
        <p>Address: ${req.body.StreetAddress}, ${req.body.city}, ${req.body.state}, ${req.body.PinCode}</p>
        <p>Email: ${req.body.Email}</p>
        <p>Payment Method: ${req.body.PaymentMethod}</p>
        <h2>Products:</h2>
        <ul>
          ${userCart.items.map(item => `
            <li>${item.quantity} x ${item.product} - ${item.subtotal}</li>
          `).join('')}
        </ul>
        <p>Total: ${savedBillingDetail.cart.reduce((acc, item) => acc + item.subtotal, 0)}</p>
      `
    };

    const clientMailOptions = {
      from: process.env.EMAIL_USER,
      to: 'client_email@example.com', // Email of the client who will process the order
      subject: 'New order received!',
      html: `
        <h1>New order received!</h1>
        <p>Order Number: ${orderNo}</p>
        <p>Order Date: ${date}</p>
        <p>Name: ${req.body.FirstName} ${req.body.LastName}</p>
        <p>Address: ${req.body.StreetAddress}, ${req.body.city}, ${req.body.state}, ${req.body.PinCode}</p>
        <p>Email: ${req.body.Email}</p>
        <p>Payment Method: ${req.body.PaymentMethod}</p>
        <h2>Products:</h2>
        <ul>
          ${userCart.items.map(item => `
            <li>${item.quantity} x ${item.product} - ${item.subtotal}</li>
          `).join('')}
        </ul>
        <p>Total: ${savedBillingDetail.cart.reduce((acc, item) => acc + item.subtotal, 0)}</p>
      `
    };

    transporter.sendMail(customerMailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Customer email sent: ' + info.response);
      }
    });

    transporter.sendMail(clientMailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Client email sent: ' + info.response);
      }
    });

    res.status(201).json(savedBillingDetail);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
