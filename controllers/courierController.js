const Courier = require('../models/Courier');

/**
 * GET /api/couriers
 * Return all couriers
 */
exports.getCouriers = async (req, res) => {
  try {
    const couriers = await Courier.find().lean();
    const normalized = couriers.map(c => ({
      ...c,
      coords: c.coords || { latitude: 0, longitude: 0 }
    }));
    res.json(normalized);
  } catch (err) {
    console.error('getCouriers error', err);
    res.status(500).json({ message: 'Error fetching couriers' });
  }
};

/**
 * GET /api/couriers/:id
 */
exports.getCourierById = async (req, res) => {
  try {
    const courier = await Courier.findById(req.params.id).lean();
    if (!courier) return res.status(404).json({ message: 'Courier not found' });
    courier.coords = courier.coords || { latitude: 0, longitude: 0 };
    res.json(courier);
  } catch (err) {
    console.error('getCourierById error', err);
    res.status(500).json({ message: 'Error fetching courier' });
  }
};

/**
 * POST /api/couriers
 * Create a courier
 */
exports.createCourier = async (req, res) => {
  try {
    const courier = new Courier(req.body);
    await courier.save();
    res.status(201).json(courier);
  } catch (err) {
    console.error('createCourier error', err);
    res.status(400).json({ message: err.message });
  }
};

/**
 * PUT /api/couriers/:id/location
 * Update location and emit via Socket.IO
 */
exports.updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { lat, lng, status, destination } = req.body;

    const courier = await Courier.findById(id);
    if (!courier) return res.status(404).json({ message: 'Courier not found' });

    courier.coords = { latitude: lat, longitude: lng };
    if (status) courier.status = status;
    if (destination) courier.destination = destination;

    await courier.save();

    // Emit update
    const io = req.app.get('io');
    if (io) io.emit('courierLocationUpdated', courier);

    res.json({ message: 'Location updated', courier });
  } catch (err) {
    console.error('updateLocation error', err);
    res.status(400).json({ message: err.message });
  }
};
