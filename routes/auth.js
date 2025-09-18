// routes/auth.js
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const authController = require('../controllers/authController');

router.post('/register',
  [ body('email').isEmail(), body('password').isLength({ min: 6 }) ],
  authController.register
);

router.post('/login', authController.login);

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;
