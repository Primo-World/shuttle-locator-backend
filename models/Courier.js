const mongoose = require('mongoose');

const CourierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    coords: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    status: { type: String, default: 'available' }, // available, pickingUp, delivering
    destination: { type: String, default: '' }, // optional destination address
  },
  { timestamps: true }
);

module.exports = mongoose.models.Courier || mongoose.model('Courier', CourierSchema);
