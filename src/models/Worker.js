const mongoose = require("mongoose");

const PortfolioItemSchema = new mongoose.Schema({
  image: { type: String, required: true }
});

const SkillBarSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pct: { type: Number, required: true }
});

const WorkerReviewSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  date: { type: String, required: true },
  verified: { type: Boolean, default: false }
});

const WorkerSchema = new mongoose.Schema(
  {
    workerId: {
      type: Number,
      unique: true,
      required: true
    },
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone number"]
    },
    avatar: {
      type: String,
      required: true
    },
    coverImage: {
      type: String,
      required: true
    },
    portfolio: [PortfolioItemSchema],
    skill: {
      type: String,
      required: true,
      trim: true
    },
    subSkills: [{ type: String }],
    experience: {
      type: Number,
      required: true,
      min: 0
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1.0,
      max: 5.0
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    reviews: [WorkerReviewSchema],
    city: {
      type: String,
      required: true
    },
    zone: {
      type: String,
      required: true
    },
    availability: {
      type: String,
      enum: ["available", "busy"],
      default: "available"
    },
    verified: {
      type: Boolean,
      default: false
    },
    completedJobs: {
      type: Number,
      default: 0
    },
    joinDate: {
      type: String,
      required: true
    },
    emergencyAvailable: {
      type: Boolean,
      default: false
    },
    languages: [{ type: String }],
    skillBars: [SkillBarSchema],
    bio: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Worker", WorkerSchema);
