const express = require('express');
const router = express.Router();
const shuttleController = require('../controllers/shuttleController');

// Public: get all shuttle routes
router.get('/routes', shuttleController.getShuttleRoutes);

// Public: list all shuttles (optional, can be merged with the one above)
router.get('/', shuttleController.getShuttles);

// Public: get one shuttle
router.get('/:id', shuttleController.getShuttleById);

// Admin/protected: create shuttle (you can add auth middleware later)
router.post('/', shuttleController.createShuttle);

// Driver: update location (no auth here for demo; add protect middleware in production)
router.put('/:id/location', shuttleController.updateLocation);

module.exports = router;
