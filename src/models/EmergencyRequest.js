const mongoose = require("mongoose");

const NearbyWorkerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  skill: { type: String, required: true },
  eta: { type: String, required: true },
  rating: { type: Number, required: true },
  jobs: { type: Number, required: true },
  img: { type: String, required: true },
  available: { type: Boolean, default: true },
  price: { type: Number, required: true }
});

const EmergencyRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false // Optional for guest scanning
    },
    category: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["scanning", "found", "dispatched", "completed"],
      default: "scanning"
    },
    nearbyWorkers: [NearbyWorkerSchema],
    dispatchedWorkerName: {
      type: String,
      default: null
    },
    dispatchedWorkerId: {
      type: Number,
      default: null
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmergencyRequest", EmergencyRequestSchema);
