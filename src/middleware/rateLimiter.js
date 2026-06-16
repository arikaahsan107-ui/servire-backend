const rateLimit = require("express-rate-limit");

// Limit total requests to 1000 per 1 minute
const globalRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000,
  message: {
    message: "Too many requests from this IP. Please try again after 1 minute."
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Limit login/register attempts to 100 per 1 minute
const authRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
  message: {
    message: "Too many login/registration attempts. Please try again after 1 minute."
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  globalRateLimiter,
  authRateLimiter
};
