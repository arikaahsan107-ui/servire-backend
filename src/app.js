const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const { globalRateLimiter } = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorMiddleware");

// Route Imports
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const workerRoutes = require("./routes/workerRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

// 1. Security HTTP Headers
app.use(helmet());

// 2. CORS
app.use(
  cors({
    origin: "*", // Adjust origins as appropriate for local testing
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 3. Body Parsers (Request payloads)
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// 4. Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// 5. Data Sanitization against XSS
app.use(xss());

// 6. Global Rate Limiter
app.use(globalRateLimiter);

// 7. Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date() });
});

// Mock Swagger / API documentation
app.get("/api/docs", (req, res) => {
  try {
    const swaggerDoc = require("../swagger.json");
    res.status(200).json(swaggerDoc);
  } catch (error) {
    res.status(404).json({ message: "API specification file not found" });
  }
});

// 8. Register App Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);

// 9. 404 Fallback Route Handler
app.all("*", (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.statusCode = 404;
  next(err);
});

// 10. Global Error Handling Middleware
app.use(errorHandler);

module.exports = app;
