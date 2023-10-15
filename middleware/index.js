import  jwt  from 'jsonwebtoken';
import User from '../models/user.js';
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({
      statusText: "Unauthorized",
      message: "Token is missing.",
    });
  }
  jwt.verify(token, process.env.SECRET, async (err, decoded) => {
    if (err) {
      console.error("JWT Verification Error:", err); // Log the error for debugging
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

export default authenticateToken;