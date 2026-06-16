const express = require("express");
const {
  getWorkers,
  getWorkerById,
  updateWorkerProfile,
  updateAvailability,
  getWorkerPortfolio
} = require("../controllers/workerController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getWorkers);
router.get("/:id", getWorkerById);
router.get("/:id/portfolio", getWorkerPortfolio);

// Protected routes (require user login context)
router.put("/profile", protect, updateWorkerProfile);
router.put("/availability", protect, updateAvailability);

module.exports = router;
