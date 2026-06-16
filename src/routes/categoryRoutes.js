const express = require("express");
const {
  getCategories,
  getCategoryById,
  getCategoryWorkers
} = require("../controllers/categoryController");

const router = express.Router();

// Category catalogs are open to search visitors publicly
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.get("/:id/workers", getCategoryWorkers);

module.exports = router;
