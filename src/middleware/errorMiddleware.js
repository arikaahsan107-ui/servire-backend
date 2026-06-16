const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  if (process.env.NODE_ENV !== "production") {
    console.error("[GLOBAL ERROR LOG]", err);
  }

  // Mongoose bad ObjectId CastError
  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.value}`;
    error = new Error(message);
    error.statusCode = 404;
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new Error(message);
    error.statusCode = 400;
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new Error(message.join(", "));
    error.statusCode = 400;
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    error = new Error("Invalid token. Please authenticate again.");
    error.statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    error = new Error("Your session token has expired. Please log in again.");
    error.statusCode = 401;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server Error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
};

module.exports = errorHandler;
