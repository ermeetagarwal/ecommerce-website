const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
router.post("/login", async (req, res) => {
    try {
      const username = req.body.email;
      const password = req.body.password
      if((username===process.env.ADMIN_USERNAME)&&(password===process.env.ADMIN_PASSWORD)){
        const token = jwt.sign({}, process.env.SECRET_ADMIN, {
            expiresIn: '1h',
          });
          res.status(200).json({
            statusText: "Success",
            message: "Admin successfully logged in.",
            token: token,
          });
      }
      else {
        return res.status(401).json({
          statusText: "Unauthorized",
          message: "Invalid Credentials",
        });
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      return res.status(500).send("An unexpected error occurred.");
    }
  });
  module.exports = router;
