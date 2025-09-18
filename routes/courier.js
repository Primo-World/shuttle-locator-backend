const express = require('express');
const router = express.Router();
const courierController = require('../controllers/courierController');

// Public: list couriers
router.get('/', courierController.getCouriers);

// Public: get courier by ID
router.get('/:id', courierController.getCourierById);

// Admin/protected: create courier
router.post('/', courierController.createCourier);

// Driver: update location
router.put('/:id/location', courierController.updateLocation);

module.exports = router;
