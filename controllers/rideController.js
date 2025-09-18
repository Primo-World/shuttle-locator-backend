const Ride = require('../models/Ride');

/**
 * GET /api/rides
 * Return all rides
 */
exports.getRides = async (req, res) => {
  try {
    const rides = await Ride.find().lean();
    // normalize coordinates for frontend convenience
    const normalized = rides.map(r => ({
      ...r,
      coords: r.coords || { latitude: 0, longitude: 0 }
    }));
    res.json(normalized);
  } catch (err) {
    console.error('getRides error', err);
    res.status(500).json({ message: 'Error fetching rides' });
  }
};

/**
 * GET /api/rides/:id
 */
exports.getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).lean();
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    ride.coords = ride.coords || { latitude: 0, longitude: 0 };
    res.json(ride);
  } catch (err) {
    console.error('getRideById error', err);
    res.status(500).json({ message: 'Error fetching ride' });
  }
};

/**
 * POST /api/rides
 * Create a ride
 */
exports.createRide = async (req, res) => {
  try {
    const ride = new Ride(req.body);
    await ride.save();
    res.status(201).json(ride);
  } catch (err) {
    console.error('createRide error', err);
    res.status(400).json({ message: err.message });
  }
};

/**
 * PUT /api/rides/:id/location
 * Update location and emit via Socket.IO
 */
exports.updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { lat, lng } = req.body;

    const ride = await Ride.findById(id);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    ride.coords = { latitude: lat, longitude: lng };
    await ride.save();

    // Emit update
    const io = req.app.get('io');
    if (io) io.emit('rideLocationUpdated', ride);

    res.json({ message: 'Location updated', ride });
  } catch (err) {
    console.error('updateLocation error', err);
    res.status(400).json({ message: err.message });
  }
};
