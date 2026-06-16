const express = require("express");
const {
  createBooking,
  getBookingById,
  cancelBooking,
  updateBookingStatus,
  getBookingsByWorker
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply auth middleware to protect booking operations
router.use(protect);

router.post("/", createBooking);
router.get("/:id", getBookingById);
router.put("/:id/cancel", cancelBooking);
router.put("/:id/status", updateBookingStatus);
router.get("/worker/:workerId", getBookingsByWorker);

module.exports = router;
