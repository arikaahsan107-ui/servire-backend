const Worker = require("../models/Worker");

// @desc    Get all workers with search, filters, sorting and pagination
// @route   GET /api/workers
// @access  Public
const getWorkers = async (req, res, next) => {
  try {
    const {
      search,
      skill,
      city,
      rating,
      verified,
      availability,
      sort,
      page,
      limit
    } = req.query;

    const queryObj = {};

    // 1. Search name/skill keyword matching
    if (search) {
      queryObj.$or = [
        { name: { $regex: search, $options: "i" } },
        { skill: { $regex: search, $options: "i" } }
      ];
    }

    // 2. Direct Filters
    if (skill) {
      queryObj.skill = skill;
    }
    if (city) {
      queryObj.city = city;
    }
    if (availability) {
      queryObj.availability = availability;
    }
    if (verified === "true") {
      queryObj.verified = true;
    }
    if (rating) {
      queryObj.rating = { $gte: parseFloat(rating) };
    }

    // 3. Sorting logic
    let sortBy = "-rating"; // Default sort
    if (sort === "price_asc") {
      sortBy = "price";
    } else if (sort === "price_desc") {
      sortBy = "-price";
    } else if (sort === "jobs") {
      sortBy = "-completedJobs";
    } else if (sort === "rating") {
      sortBy = "-rating";
    }

    // 4. Pagination limits
    const currentPage = parseInt(page, 10) || 1;
    const perPage = parseInt(limit, 10) || 12;
    const skip = (currentPage - 1) * perPage;

    const workers = await Worker.find(queryObj)
      .sort(sortBy)
      .skip(skip)
      .limit(perPage);

    const total = await Worker.countDocuments(queryObj);

    res.status(200).json({
      success: true,
      count: workers.length,
      total,
      pages: Math.ceil(total / perPage),
      currentPage,
      workers
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single worker by ID (supports numeric ID)
// @route   GET /api/workers/:id
// @access  Public
const getWorkerById = async (req, res, next) => {
  try {
    const idParam = req.params.id;
    let worker;

    // Check if parameter is a numeric value
    if (!isNaN(idParam)) {
      worker = await Worker.findOne({ workerId: parseInt(idParam, 10) });
    } else {
      worker = await Worker.findById(idParam);
    }

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.status(200).json({ success: true, worker });
  } catch (err) {
    next(err);
  }
};

// @desc    Update worker profile (admin or authorized helper)
// @route   PUT /api/workers/profile
// @access  Private
const updateWorkerProfile = async (req, res, next) => {
  try {
    // Standard update matching req.body payload
    const { name, phone, price, bio, availability, languages } = req.body;

    const worker = await Worker.findOne({ email: req.user.email });
    if (!worker) {
      return res.status(404).json({ message: "Worker profile not found for this user context" });
    }

    if (name) worker.name = name;
    if (phone) worker.phone = phone;
    if (price) worker.price = price;
    if (bio) worker.bio = bio;
    if (availability) worker.availability = availability;
    if (languages) worker.languages = languages;

    await worker.save();

    res.status(200).json({ success: true, message: "Worker profile updated", worker });
  } catch (err) {
    next(err);
  }
};

// @desc    Update worker availability status
// @route   PUT /api/workers/availability
// @access  Private
const updateAvailability = async (req, res, next) => {
  try {
    const { availability } = req.body;
    if (!availability || !["available", "busy"].includes(availability)) {
      return res.status(400).json({ message: "Please provide a valid availability state" });
    }

    const worker = await Worker.findOne({ email: req.user.email });
    if (!worker) {
      return res.status(404).json({ message: "Worker profile not found" });
    }

    worker.availability = availability;
    await worker.save();

    res.status(200).json({ success: true, message: "Availability state updated", availability });
  } catch (err) {
    next(err);
  }
};

// @desc    Get worker portfolio images
// @route   GET /api/workers/:id/portfolio
// @access  Public
const getWorkerPortfolio = async (req, res, next) => {
  try {
    const idParam = req.params.id;
    let worker;

    if (!isNaN(idParam)) {
      worker = await Worker.findOne({ workerId: parseInt(idParam, 10) });
    } else {
      worker = await Worker.findById(idParam);
    }

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.status(200).json({ success: true, portfolio: worker.portfolio });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getWorkers,
  getWorkerById,
  updateWorkerProfile,
  updateAvailability,
  getWorkerPortfolio
};
