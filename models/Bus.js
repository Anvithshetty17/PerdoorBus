const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
  busName: {
    type: String,
    required: true,
    trim: true
  },
  busNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  route: {
    type: String,
    required: true,
    trim: true
  },
  departureTime: {
    type: String, // Format: "HH:MM" (24-hour format)
    required: true
  },
  arrivalTime: {
    type: String, // Format: "HH:MM" (24-hour format)
    required: true
  },
  operatingDays: {
    type: [String], // ["Monday", "Tuesday", etc.] or ["Daily"]
    default: ["Daily"]
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better performance
BusSchema.index({ route: 1, departureTime: 1 });

module.exports = mongoose.model('Bus', BusSchema);