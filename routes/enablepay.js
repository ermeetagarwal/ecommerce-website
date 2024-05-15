const express = require("express");
const EnablePayMode = require("../models/enablepaymode.js");
const { authenticateToken, authenticateAdminToken } = require("../middleware/index.js");
const router = express.Router();
// POST route to set payment method status
router.post("/enablepaymode",authenticateAdminToken, async (req, res) => {
  try {
    const { cod, online } = req.body;

    // Use findOneAndUpdate to ensure document creation if it doesn't exist
    await EnablePayMode.findOneAndUpdate({}, { cod, online }, { upsert: true });

    res.status(200).json({ message: "Payment method status updated successfully." });
  } catch (err) {
    console.error("Error updating payment method status:", err);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

// GET route to get payment method status
router.get("/enablepaymode", async (req, res) => {
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