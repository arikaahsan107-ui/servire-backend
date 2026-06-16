const express = require("express");
const {
  getAdminStats,
  getCityAnalytics,
  getWorkerAnalytics,
  getBookingAnalytics,
  getAllUsers,
  updateUserRole,
  verifyWorker,
  deleteUser
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

// Enforce admin-only access control policies
router.use(protect);
router.use(authorize("admin"));

router.get("/stats", getAdminStats);
router.get("/analytics/cities", getCityAnalytics);
router.get("/analytics/workers", getWorkerAnalytics);
router.get("/analytics/bookings", getBookingAnalytics);
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.put("/workers/:id/verify", verifyWorker);
router.delete("/users/:id", deleteUser);

module.exports = router;
