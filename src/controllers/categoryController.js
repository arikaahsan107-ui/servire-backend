const Category = require("../models/Category");
const Worker = require("../models/Worker");

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort("label");
    res.status(200).json({ success: true, count: categories.length, categories });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single category details
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ success: true, category });
  } catch (err) {
    next(err);
  }
};

// @desc    Get workers belonging to a category
// @route   GET /api/categories/:id/workers
// @access  Public
const getCategoryWorkers = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Find workers with matching skill label
    const workers = await Worker.find({ skill: category.label }).sort("-rating");

    res.status(200).json({
      success: true,
      category: category.label,
      count: workers.length,
      workers
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  getCategoryWorkers
};
