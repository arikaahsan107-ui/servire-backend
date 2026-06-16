const User = require("../models/User");
const Booking = require("../models/Booking");
const Favorite = require("../models/Favorite");
const Worker = require("../models/Worker");

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;

    // Optional password update
    if (req.body.password) {
      user.password = req.body.password;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user bookings
// @route   GET /api/users/bookings
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort("-createdAt");
    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user favorites
// @route   GET /api/users/favorites
// @access  Private
const getMyFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.id });
    const workerIds = favorites.map((fav) => fav.workerId);
    
    // Find worker profiles matching the list of workerIds
    const workers = await Worker.find({ workerId: { $in: workerIds } });
    
    res.status(200).json({ success: true, count: workers.length, workers });
  } catch (err) {
    next(err);
  }
};

// @desc    Add worker to favorites
// @route   POST /api/users/favorites/:workerId
// @access  Private
const addFavorite = async (req, res, next) => {
  try {
    const workerId = parseInt(req.params.workerId);
    
    // Check if worker exists
    const worker = await Worker.findOne({ workerId });
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    // Check if already in favorites
    const favExists = await Favorite.findOne({ userId: req.user.id, workerId });
    if (favExists) {
      return res.status(400).json({ message: "Worker is already in your favorites" });
    }

    await Favorite.create({
      userId: req.user.id,
      workerId
    });

    res.status(201).json({ success: true, message: "Worker saved to favorites" });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove worker from favorites
// @route   DELETE /api/users/favorites/:workerId
// @access  Private
const removeFavorite = async (req, res, next) => {
  try {
    const workerId = parseInt(req.params.workerId);

    const favorite = await Favorite.findOneAndDelete({
      userId: req.user.id,
      workerId
    });

    if (!favorite) {
      return res.status(404).json({ message: "Favorite entry not found" });
    }

    res.status(200).json({ success: true, message: "Worker removed from favorites" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getMyBookings,
  getMyFavorites,
  addFavorite,
  removeFavorite
};
