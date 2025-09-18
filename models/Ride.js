const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    driver: { type: String, default: "Unassigned" },
    car: { type: String, default: "" },
    route: { type: String },
    coords: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    available: { type: Boolean, default: true },
    status: { type: String, default: "pending" }, // pending, inTransit, completed
  },
  { timestamps: true }
);

module.exports = mongoose.models.Ride || mongoose.model('Ride', RideSchema);
