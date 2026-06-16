const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    workerId: {
      type: Number, // Reference numeric workerId
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    text: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
