const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    workerId: {
      type: Number, // Match numeric id of workers
      required: true
    },
    workerName: {
      type: String,
      required: true
    },
    workerSkill: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    notes: {
      type: String,
      default: ""
    },
    isEmergency: {
      type: Boolean,
      default: false
    },
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);
