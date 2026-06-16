const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || "your_super_secret_jwt_access_key_12345");

      // Get user from the token, excluding password
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found with this token" });
      }

      next();
    } catch (error) {
      console.error("[AUTH MIDDLEWARE] Token verification failed:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed or expired" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

module.exports = { protect };
