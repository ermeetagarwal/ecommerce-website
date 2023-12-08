const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const authenticateToken = (req, res, next) => {
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
      req.user = user;
      next();
    } catch (err) {
      console.error("Authentication error:", err);
      res.status(500).send("An unexpected error occurred during authentication.");
    }
  });
};


module.exports = authenticateToken;