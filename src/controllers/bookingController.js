const Booking = require("../models/Booking");
const Worker = require("../models/Worker");
const { bookingSchema } = require("../validators/bookingValidator");

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { error } = bookingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { workerId, date, time, address, notes, emerg } = req.body;

    // Fetch worker details to check price & metadata
    const worker = await Worker.findOne({ workerId });
    if (!worker) {
      return res.status(404).json({ message: "Selected professional worker not found" });
    }

    // Generate random booking ID
    const bkId = `SRV_${Math.random().toString(36).substring(2, 7).toUpperCase()}_${Date.now().toString(36).slice(-3).toUpperCase()}`;

    // Base Price calculations
    const basePrice = worker.price;
    const emergencyFee = emerg ? Math.round(basePrice * 0.5) : 0;
    const totalAmount = basePrice + emergencyFee;

    const booking = await Booking.create({
      bookingId: bkId,
      userId: req.user.id,
      workerId,
      workerName: worker.name,
      workerSkill: worker.skill,
      date,
      time,
      address,
      notes,
      isEmergency: emerg,
      totalAmount,
      status: "pending"
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get booking details
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const idParam = req.params.id;
    let booking;

    if (idParam.startsWith("SRV_")) {
      booking = await Booking.findOne({ bookingId: idParam }).populate("userId", "name email");
    } else {
      booking = await Booking.findById(idParam).populate("userId", "name email");
    }

    if (!booking) {
      return res.status(404).json({ message: "Booking record not found" });
    }

    // Ensure authorized client access (either the creator or an admin)
    if (booking.userId._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access forbidden to this booking record" });
    }

    res.status(200).json({ success: true, booking });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const idParam = req.params.id;
    let booking;

    if (idParam.startsWith("SRV_")) {
      booking = await Booking.findOne({ bookingId: idParam });
    } else {
      booking = await Booking.findById(idParam);
    }

    if (!booking) {
      return res.status(404).json({ message: "Booking record not found" });
    }

    // Access authorization check
    if (booking.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    if (booking.status === "completed") {
      return res.status(400).json({ message: "Completed bookings cannot be cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({ success: true, message: "Booking successfully cancelled", booking });
  } catch (err) {
    next(err);
  }
};

// @desc    Update booking status (admin or internal dispatcher)
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status || !["pending", "confirmed", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Please provide a valid status transition" });
    }

    const idParam = req.params.id;
    let booking;

    if (idParam.startsWith("SRV_")) {
      booking = await Booking.findOne({ bookingId: idParam });
    } else {
      booking = await Booking.findById(idParam);
    }

    if (!booking) {
      return res.status(404).json({ message: "Booking record not found" });
    }

    booking.status = status;
    await booking.save();

    // If marked completed, increment worker jobs completed counter
    if (status === "completed") {
      await Worker.findOneAndUpdate(
        { workerId: booking.workerId },
        { $inc: { completedJobs: 1 } }
      );
    }

    res.status(200).json({ success: true, message: `Booking status updated to ${status}`, booking });
  } catch (err) {
    next(err);
  }
};

// @desc    Get bookings matching a particular workerId
// @route   GET /api/bookings/worker/:workerId
// @access  Private
const getBookingsByWorker = async (req, res, next) => {
  try {
    const workerId = parseInt(req.params.workerId, 10);
    const bookings = await Booking.find({ workerId }).sort("-createdAt");
    
    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking,
  getBookingById,
  cancelBooking,
  updateBookingStatus,
  getBookingsByWorker
};
