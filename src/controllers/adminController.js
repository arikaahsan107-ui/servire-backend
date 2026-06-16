const User = require("../models/User");
const Worker = require("../models/Worker");
const Booking = require("../models/Booking");
const AdminLog = require("../models/AdminLog");

// Helper: Log admin actions
const logAdminAction = async (adminId, action, targetUser, details) => {
  try {
    await AdminLog.create({
      adminId,
      action,
      targetUser,
      details
    });
  } catch (err) {
    console.error("[ADMIN CONTROLLER] Failed to save admin log:", err.message);
  }
};

// @desc    Get dashboard summary stats
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getAdminStats = async (req, res, next) => {
  try {
    const totalWorkers = await Worker.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    // Calculate total revenue
    const bookings = await Booking.find({ status: { $ne: "cancelled" } });
    const totalRevenue = bookings.reduce((sum, current) => sum + current.totalAmount, 0);

    const activeNow = await Worker.countDocuments({ availability: "available" });

    res.status(200).json({
      success: true,
      stats: {
        totalWorkers,
        totalUsers,
        totalBookings,
        totalRevenue,
        activeNow,
        averageRating: 4.8 // Seed average default
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get analytics grouped by Pakistan cities
// @route   GET /api/admin/analytics/cities
// @access  Private (Admin only)
const getCityAnalytics = async (req, res, next) => {
  try {
    const cityData = await Worker.aggregate([
      {
        $group: {
          _id: "$city",
          workers: { $sum: 1 },
          activeNow: {
            $sum: { $cond: [{ $eq: ["$availability", "available"] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          city: "$_id",
          workers: 1,
          activeNow: 1,
          bookings: { $multiply: ["$workers", 22] } // Mock booking activities matching frontend computations
        }
      },
      { $sort: { workers: -1 } }
    ]);

    res.status(200).json({ success: true, cities: cityData });
  } catch (err) {
    next(err);
  }
};

// @desc    Get worker performance statistics
// @route   GET /api/admin/analytics/workers
// @access  Private (Admin only)
const getWorkerAnalytics = async (req, res, next) => {
  try {
    const workers = await Worker.find().select("name skill rating completedJobs city verified");
    res.status(200).json({ success: true, workers });
  } catch (err) {
    next(err);
  }
};

// @desc    Get booking metrics
// @route   GET /api/admin/analytics/bookings
// @access  Private (Admin only)
const getBookingAnalytics = async (req, res, next) => {
  try {
    const bookings = await Booking.find().select("bookingId date totalAmount status isEmergency");
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort("-createdAt");
    res.status(200).json({ success: true, count: users.length, users });
  } catch (err) {
    next(err);
  }
};

// @desc    Assign user system roles
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin only)
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Please specify a valid system role (user/admin)" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    await logAdminAction(
      req.user.id,
      "UPDATE_ROLE",
      user.email,
      `Changed role of ${user.name} from ${oldRole} to ${role}`
    );

    res.status(200).json({ success: true, message: `Successfully updated user role to ${role}`, user });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify or unverify worker profile
// @route   PUT /api/admin/workers/:id/verify
// @access  Private (Admin only)
const verifyWorker = async (req, res, next) => {
  try {
    const { verified } = req.body;
    if (verified === undefined) {
      return res.status(400).json({ message: "Please specify verified boolean value" });
    }

    const workerIdVal = parseInt(req.params.id, 10);
    const worker = await Worker.findOne({ workerId: workerIdVal });
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    worker.verified = !!verified;
    await worker.save();

    await logAdminAction(
      req.user.id,
      "VERIFY_WORKER",
      worker.email,
      `Set verification status of worker ${worker.name} to ${verified}`
    );

    res.status(200).json({ success: true, message: `Worker verification status updated to ${verified}`, worker });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user account
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(req.params.id);

    await logAdminAction(
      req.user.id,
      "DELETE_USER",
      user.email,
      `Deleted account of user: ${user.name}`
    );

    res.status(200).json({ success: true, message: "User account deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAdminStats,
  getCityAnalytics,
  getWorkerAnalytics,
  getBookingAnalytics,
  getAllUsers,
  updateUserRole,
  verifyWorker,
  deleteUser
};
