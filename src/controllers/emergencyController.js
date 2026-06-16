const EmergencyRequest = require("../models/EmergencyRequest");
const Worker = require("../models/Worker");

// Helper: Translate emergency category to worker skill labels
const mapEmergencyToSkill = (category) => {
  const mapping = {
    Electric: "Electrician",
    Water: "Plumber",
    AC: "AC Technician",
    Lockout: "Carpenter", // Carpenters handle locking issues
    Fire: "Gardener", // Emergency support fallback
    Medical: "Driver" // Drivers can pick up/transport
  };
  return mapping[category] || "Electrician";
};

// @desc    Submit emergency request and scan for workers
// @route   POST /api/emergency/request
// @access  Public
const submitEmergencyRequest = async (req, res, next) => {
  try {
    const { category } = req.body;
    if (!category) {
      return res.status(400).json({ message: "Please specify an emergency category" });
    }

    const skillNeeded = mapEmergencyToSkill(category);

    // Fetch verified available workers with requested skill
    const workers = await Worker.find({
      skill: skillNeeded,
      availability: "available",
      emergencyAvailable: true
    }).limit(4);

    // Map to nearby emergency records format
    const nearbyWorkers = workers.map((w, index) => ({
      name: w.name,
      skill: w.skill,
      eta: `${2 + index * 3} min`,
      rating: w.rating,
      jobs: w.completedJobs,
      img: w.avatar,
      available: w.availability === "available",
      price: w.price
    }));

    // Generate Request entry
    const emergencyRequest = await EmergencyRequest.create({
      userId: req.user ? req.user.id : null,
      category,
      status: "scanning",
      nearbyWorkers
    });

    res.status(201).json({
      success: true,
      message: "Emergency request registered. Scanning initialized.",
      request: emergencyRequest
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get nearby emergency workers
// @route   GET /api/emergency/nearby
// @access  Public
const getNearbyEmergencyWorkers = async (req, res, next) => {
  try {
    const { category } = req.query;
    const skillNeeded = mapEmergencyToSkill(category || "Electric");

    const workers = await Worker.find({
      skill: skillNeeded,
      availability: "available",
      emergencyAvailable: true
    }).limit(4);

    const formatted = workers.map((w, i) => ({
      name: w.name,
      skill: w.skill,
      eta: `${2 + i * 3} min`,
      rating: w.rating,
      jobs: w.completedJobs,
      img: w.avatar,
      available: true,
      price: w.price
    }));

    res.status(200).json({ success: true, count: formatted.length, workers: formatted });
  } catch (err) {
    next(err);
  }
};

// @desc    Dispatch professional to emergency request location
// @route   POST /api/emergency/dispatch/:workerId
// @access  Public
const dispatchEmergencyWorker = async (req, res, next) => {
  try {
    const { requestId } = req.body;
    if (!requestId) {
      return res.status(400).json({ message: "Emergency requestId is required in request body" });
    }

    const workerIdVal = parseInt(req.params.workerId, 10);
    const worker = await Worker.findOne({ workerId: workerIdVal });
    if (!worker) {
      return res.status(404).json({ message: "Worker profile not found to dispatch" });
    }

    const emergency = await EmergencyRequest.findById(requestId);
    if (!emergency) {
      return res.status(404).json({ message: "Emergency request record not found" });
    }

    emergency.status = "dispatched";
    emergency.dispatchedWorkerName = worker.name;
    emergency.dispatchedWorkerId = worker.workerId;
    await emergency.save();

    res.status(200).json({
      success: true,
      message: `Successfully dispatched ${worker.name} for emergency assist.`,
      request: emergency
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current status of emergency request
// @route   GET /api/emergency/status/:requestId
// @access  Public
const getEmergencyStatus = async (req, res, next) => {
  try {
    const emergency = await EmergencyRequest.findById(req.params.requestId);
    if (!emergency) {
      return res.status(404).json({ message: "Emergency request not found" });
    }

    res.status(200).json({ success: true, request: emergency });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitEmergencyRequest,
  getNearbyEmergencyWorkers,
  dispatchEmergencyWorker,
  getEmergencyStatus
};
