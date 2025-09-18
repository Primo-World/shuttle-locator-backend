// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: String,
  avatar: String,
  role: { 
    type: String, 
    enum: ['user', 'driver'], // <-- ADD THIS LINE
    default: 'user' 
  },
  settings: {
    notifications: { type: Boolean, default: true },
    accessibility: {
      largeText: { type: Boolean, default: false },
      vibration: { type: Boolean, default: true },
      reduceMotion: { type: Boolean, default: false }
    },
    communication: {}
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });

// hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// helper to compare password
userSchema.methods.matchPassword = function(plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);