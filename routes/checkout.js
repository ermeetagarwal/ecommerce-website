const express = require("express");
const router = express.Router();
const billingdetails = require("../models/checkout.js");

// GET all billing details
router.get("/billingdetails", async (req, res) => {
  try {
    const allBillingDetails = await billingdetails.find();
    res.json(allBillingDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/billingdetails", async (req, res) => {
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
      PaymentMethod
    });
  
    try {
      const savedBillingDetail = await newBillingDetail.save();
      res.status(201).json(savedBillingDetail);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
module.exports = router;
