const mongoose = require("mongoose");

const AdminLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    action: {
      type: String,
      required: true
    },
    targetUser: {
      type: String, // Email or userId string
      default: null
    },
    details: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminLog", AdminLogSchema);
