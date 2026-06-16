const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      unique: true
    },
    icon: {
      type: String,
      required: true
    },
    coverImg: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
