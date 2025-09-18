const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    type: { type: String, enum: ["ride", "shuttle", "courier"], required: true },
    title: { type: String, required: true },
    status: { type: String, enum: ["completed", "inTransit", "upcoming", "cancelled"], default: "upcoming" },
    location: String,
    details: String,
    actions: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
