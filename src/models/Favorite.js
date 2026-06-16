const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    workerId: {
      type: Number, // Reference numeric workerId
      required: true
    }
  },
  { timestamps: true }
);

// Unique index to prevent duplicate saves
FavoriteSchema.index({ userId: 1, workerId: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", FavoriteSchema);
