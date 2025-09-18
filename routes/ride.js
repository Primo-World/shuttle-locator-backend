const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController');

// Public: list rides
router.get('/', rideController.getRides);

// Public: get ride by ID
router.get('/:id', rideController.getRideById);

// Admin/protected: create ride
router.post('/', rideController.createRide);

// Driver: update location
router.put('/:id/location', rideController.updateLocation);

module.exports = router;
