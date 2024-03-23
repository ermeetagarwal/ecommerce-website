const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const authenticateToken = async (req, res, next) => {
  const token1 = req.header('Authorization');
  if (!token1) {
    return res.status(401).json({
      statusText: "Unauthorized",
      message: "Token is missing.",
    });
  }
  const token = token1.split(' ')[1];
  jwt.verify(token, process.env.SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({
        statusText: "Forbidden",
        message: "Invalid token.",
      });
    }
    try {
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(403).json({
          statusText: "Forbidden",
          message: "User not found.",
        });
      }
      if (!user.isVerified) {
        return res.status(403).json({
          statusText: "Forbidden",
          message: "User email not verified.",
        });
      }
      req.user = user;
      next();
    } catch (err) {
      console.error("Authentication error:", err);
      res.status(500).send("An unexpected error occurred during authentication.");
    }
  });
};
const authenticateAdminToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      statusText: "Unauthorized",
      message: "Missing token",
    });
  }

  jwt.verify(token, process.env.SECRET_ADMIN, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        statusText: "Forbidden",
        message: "Invalid token",
      });
    }

    if (
      req.body.email === process.env.ADMIN_USERNAME &&
      req.body.password === process.env.ADMIN_PASSWORD
    ) {
      req.userId = decoded.userId;
      next();
    } else {
      return res.status(401).json({
        statusText: "Unauthorized",
        message: "Invalid credentials",
      });
    }
  });
};

module.exports = { authenticateToken, authenticateAdminToken };