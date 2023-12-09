const express = require("express");
const discountcode = require("../models/coupon.js");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const couponCode = req.body.code; // Assuming the coupon code is present in the request body under the key 'code'
    
    // Check if the coupon code exists in the database
    const existingCode = await discountcode.findOne({ code: couponCode });

    if (existingCode) {
      // Coupon code exists, send JSON response with discount percentage
      res.json({ success: true, message: "Coupon applied successfully", discountPercentage: existingCode.discountPercentage });
    } else {
      // Coupon code not found
      res.json({ success: false, message: "Invalid coupon code" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/list", async (req, res) => {
    try {
      // Fetch all coupons from the database
      const coupons = await discountcode.find({}, { _id: 0, __v: 0 });
  
      // Map the coupons to include only code and discountPercentage
      const formattedCoupons = coupons.map(({ code, discountPercentage }) => ({ code, discountPercentage }));
  
      res.json({ success: true, coupons: formattedCoupons });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });
  
router.post("/add", async (req, res) => {
    try {
      const { code, discountPercentage } = req.body; // Assuming both code and discountPercentage are present in the request body
  
      // Check if the coupon code already exists in the database
      const existingCode = await discountcode.findOne({ code });
  
      if (existingCode) {
        res.json({ success: false, message: "Coupon code already exists" });
      } else {
        // Coupon code does not exist, add it to the database
        const newCoupon = new discountcode({ code, discountPercentage });
        await newCoupon.save();
  
        res.json({ success: true, message: "Coupon added successfully" });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });

router.delete("/:code", async (req, res) => {
    try {
      const couponCode = req.params.code;
  
      // Check if the coupon code exists in the database
      const existingCode = await discountcode.findOne({ code: couponCode });
  
      if (existingCode) {
        // Coupon code exists, remove it from the database
        await existingCode.remove();
        res.json({ success: true, message: "Coupon removed successfully" });
      } else {
        // Coupon code not found
        res.json({ success: false, message: "Coupon code not found" });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });  
module.exports = router;
