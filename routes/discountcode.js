// routes/coupon.js
const express = require("express");
const discountcode = require("../models/coupon.js");
const authenticateToken = require("../middleware/index.js");

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
    try {
        const couponCode = req.body.code; // Assuming the coupon code is present in the request body under the key 'code'
        const cartid = req.body.cartid;
        // Check if the coupon code exists in the database
        const existingCode = await discountcode.findOne({ code: couponCode });

        if (existingCode) {
            // Coupon code exists, set the discount percentage to the cart
            const cart = await Cart.findById(cartid);
            if (cart) {
                cart.discountFromCode = existingCode.percentage;
                await cart.save();
                res.json({ success: true, message: "Coupon applied successfully", discountPercentage: existingCode.percentage });
            } else {
                res.status(404).json({ success: false, message: "Cart not found" });
            }
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

        res.json({ success: true, coupons });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

router.post("/add", async (req, res) => {
    try {
        const { code, percentage } = req.body; // Assuming both code and percentage are present in the request body

        // Check if the coupon code already exists in the database
        const existingCode = await discountcode.findOne({ code });

        if (existingCode) {
            res.json({ success: false, message: "Coupon code already exists" });
        } else {
            // Coupon code does not exist, add it to the database
            const newCoupon = new discountcode({ code, percentage });
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
