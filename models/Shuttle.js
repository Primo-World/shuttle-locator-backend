const mongoose = require('mongoose');

const shuttleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    route: {
      type: String,
      required: true,
    },
    currentLocation: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    status: {
      type: String,
      default: "idle", // e.g., idle, on route, stopped
    },
    eta: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true } // automatically adds createdAt & updatedAt
);

module.exports = mongoose.models.Shuttle || mongoose.model('Shuttle', shuttleSchema);

