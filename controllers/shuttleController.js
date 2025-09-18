const Shuttle = require('../models/Shuttle');
const asyncHandler = require('express-async-handler');

/**
 * GET /api/shuttles
 * Return all shuttles
 */
exports.getShuttles = asyncHandler(async (req, res) => {
  const shuttles = await Shuttle.find().lean();
  const normalized = shuttles.map(s => ({
    ...s,
    coords: {
      latitude: s.currentLocation?.lat || 0,
      longitude: s.currentLocation?.lng || 0
    }
  }));
  res.status(200).json(normalized);
});

/**
 * GET /api/shuttles/routes
 * Return all shuttle routes for map view
 */
exports.getShuttleRoutes = asyncHandler(async (req, res) => {
  const shuttles = await Shuttle.find().lean();
  
  const routes = shuttles.map(shuttle => ({
    id: shuttle._id.toString(),
    name: shuttle.route,
    eta: shuttle.eta,
    // Assuming you have a polyline field on your shuttle schema
    polyline: shuttle.polyline || [], 
  }));

  const buses = shuttles.map(shuttle => ({
    id: shuttle._id.toString(),
    coords: {
        latitude: shuttle.currentLocation?.lat || 0,
        longitude: shuttle.currentLocation?.lng || 0,
    },
    load: shuttle.load,
    nextStopEta: shuttle.eta
  }));

  res.status(200).json({ routes, buses });
});

/**
 * POST /api/shuttles
 * Create a shuttle (for admin)
 */
exports.createShuttle = asyncHandler(async (req, res) => {
  const { name, capacity, route } = req.body;
  if (!name || !route) {
    res.status(400);
    throw new Error('name and route required');
  }

  const shuttle = new Shuttle({ name, capacity, route });
  await shuttle.save();
  res.status(201).json(shuttle);
});

/**
 * PUT /api/shuttles/:id/location
 * Update location and emit to sockets
 */
exports.updateLocation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { lat, lng, status, eta, load } = req.body;

  const shuttle = await Shuttle.findById(id);
  if (!shuttle) {
    res.status(404);
    throw new Error('Shuttle not found');
  }

  if (typeof lat === 'number' && typeof lng === 'number') {
    shuttle.currentLocation = { lat, lng };
  }
  if (status) shuttle.status = status;
  if (eta) shuttle.eta = eta;
  if (load) shuttle.load = load;

  await shuttle.save();

  const payload = {
    id: shuttle._id.toString(),
    name: shuttle.name,
    route: shuttle.route,
    status: shuttle.status,
    eta: shuttle.eta,
    coords: {
      latitude: shuttle.currentLocation.lat,
      longitude: shuttle.currentLocation.lng
    },
    load: shuttle.load,
    updatedAt: shuttle.updatedAt
  };

  const io = req.app.get('io');
  if (io) {
    io.emit('bus_location_update', payload);
  }

  res.json({ message: 'Location updated', shuttle: payload });
});

/**
 * GET /api/shuttles/:id
 */
exports.getShuttleById = asyncHandler(async (req, res) => {
  const shuttle = await Shuttle.findById(req.params.id).lean();
  if (!shuttle) {
    res.status(404);
    throw new Error('Shuttle not found');
  }
  shuttle.coords = {
    latitude: shuttle.currentLocation.lat,
    longitude: shuttle.currentLocation.lng
  };
  res.status(200).json(shuttle);
});
