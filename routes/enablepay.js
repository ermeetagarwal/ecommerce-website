const express = require("express");
const EnablePayMode = require("../models/enablepaymode.js");
const authenticateToken = require("../middleware/index.js");
const router = express.Router();
// POST route to set payment method status
app.post("/enablepaymode", async (req, res) => {
    try {
      const { cod, online } = req.body;
  
      if (cod !== undefined) {
        await EnablePayMode.updateOne({}, { cod });
      }
  
      if (online !== undefined) {
        await EnablePayMode.updateOne({}, { online });
      }
  
      res.status(200).json({ message: "Payment method status updated successfully." });
    } catch (err) {
      console.error("Error updating payment method status:", err);
      res.status(500).json({ error: "An unexpected error occurred." });
    }
  });
  
  // GET route to get payment method status
  app.get("/enablepaymode", async (req, res) => {
    try {
      const enablePayMode = await EnablePayMode.findOne();
      if (!enablePayMode) {
        return res.status(404).json({ error: "Payment method status not found." });
      }
  
      res.status(200).json({ cod: enablePayMode.cod, online: enablePayMode.online });
    } catch (err) {
      console.error("Error fetching payment method status:", err);
      res.status(500).json({ error: "An unexpected error occurred." });
    }
  });
  module.exports = router;