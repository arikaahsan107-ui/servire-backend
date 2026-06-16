const express = require("express");
const {
  getProfile,
  updateProfile,
  getMyBookings,
  getMyFavorites,
  addFavorite,
  removeFavorite
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply auth middleware to all user routes
router.use(protect);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/bookings", getMyBookings);
router.get("/favorites", getMyFavorites);
router.post("/favorites/:workerId", addFavorite);
router.delete("/favorites/:workerId", removeFavorite);

module.exports = router;
