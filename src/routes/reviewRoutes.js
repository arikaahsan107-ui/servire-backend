const express = require("express");
const {
  createReview,
  getWorkerReviews,
  updateReview,
  deleteReview
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public route to view feedback
router.get("/worker/:workerId", getWorkerReviews);

// Protected routes to submit or modify feedback
router.post("/", protect, createReview);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;
