const Review = require("../models/Review");
const Worker = require("../models/Worker");
const { reviewSchema } = require("../validators/reviewValidator");

// Helper: Recalculate average rating of worker
const recalculateWorkerRating = async (workerId) => {
  const reviews = await Review.find({ workerId });
  const totalReviews = reviews.length;
  
  let averageRating = 5.0;
  if (totalReviews > 0) {
    const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    averageRating = parseFloat((sum / totalReviews).toFixed(1));
  }

  // Update Worker document
  await Worker.findOneAndUpdate(
    { workerId },
    {
      rating: averageRating,
      totalReviews,
      reviews: reviews.map(r => ({
        userName: r.userName,
        rating: r.rating,
        text: r.text,
        date: r.date,
        verified: r.verified
      }))
    }
  );
};

// @desc    Add review for worker
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { workerId, userName, rating, text } = req.body;

    const worker = await Worker.findOne({ workerId });
    if (!worker) {
      return res.status(404).json({ message: "Worker not found to leave review" });
    }

    const dateStr = new Date().toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });

    const review = await Review.create({
      workerId,
      userName,
      rating,
      text,
      date: dateStr,
      verified: true // Default verified when submitted via dashboard auth
    });

    // Sync rating metrics
    await recalculateWorkerRating(workerId);

    res.status(201).json({ success: true, message: "Review posted successfully", review });
  } catch (err) {
    next(err);
  }
};

// @desc    Get reviews for specific worker
// @route   GET /api/reviews/worker/:workerId
// @access  Public
const getWorkerReviews = async (req, res, next) => {
  try {
    const workerId = parseInt(req.params.workerId, 10);
    const reviews = await Review.find({ workerId }).sort("-createdAt");
    
    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    next(err);
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res, next) => {
  try {
    const { rating, text } = req.body;
    
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review record not found" });
    }

    if (rating) review.rating = rating;
    if (text) review.text = text;
    await review.save();

    // Recalculate average worker rating
    await recalculateWorkerRating(review.workerId);

    res.status(200).json({ success: true, message: "Review updated successfully", review });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review record not found" });
    }

    const workerId = review.workerId;
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate average worker rating
    await recalculateWorkerRating(workerId);

    res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createReview,
  getWorkerReviews,
  updateReview,
  deleteReview
};
