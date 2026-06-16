const express = require("express");
const {
  register,
  login,
  logout,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  verifyEmail
} = require("../controllers/authController");
const { authRateLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

// Register and Login routes have specific security rate limiters
router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);
router.post("/logout", logout);
router.post("/refresh-token", refreshAccessToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify-email/:token", verifyEmail);

module.exports = router;
