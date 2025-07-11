const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Bus = require('../models/Bus');
const auth = require('../middleware/auth');

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }

    // Find admin by username
    const admin = await Admin.findOne({ username: username.toLowerCase() });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is disabled'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Get admin profile (protected route)
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      admin: {
        id: req.admin._id,
        username: req.admin.username,
        email: req.admin.email,
        role: req.admin.role
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
});

// Get all buses (admin view)
router.get('/buses', auth, async (req, res) => {
  try {
    const buses = await Bus.find().sort({ route: 1, departureTime: 1 });
    res.json({
      success: true,
      buses,
      total: buses.length
    });
  } catch (error) {
    console.error('Error fetching buses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching buses'
    });
  }
});

// Add new bus (admin only)
router.post('/buses', auth, async (req, res) => {
  try {
    const { busName, busNumber, route, departureTime, arrivalTime, operatingDays } = req.body;

    // Validation
    if (!busName || !busNumber || !route || !departureTime || !arrivalTime) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if bus number already exists
    const existingBus = await Bus.findOne({ busNumber });
    if (existingBus) {
      return res.status(400).json({
        success: false,
        message: 'Bus number already exists'
      });
    }

    const bus = new Bus({
      busName,
      busNumber,
      route,
      departureTime,
      arrivalTime,
      operatingDays: operatingDays || ['Daily']
    });

    await bus.save();

    res.status(201).json({
      success: true,
      message: 'Bus added successfully',
      bus
    });
  } catch (error) {
    console.error('Error adding bus:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding bus',
      error: error.message
    });
  }
});

// Update bus (admin only)
router.put('/buses/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { busName, busNumber, route, departureTime, arrivalTime, operatingDays, isActive } = req.body;

    const bus = await Bus.findById(id);
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    // Check if bus number is being changed and if it already exists
    if (busNumber !== bus.busNumber) {
      const existingBus = await Bus.findOne({ busNumber });
      if (existingBus) {
        return res.status(400).json({
          success: false,
          message: 'Bus number already exists'
        });
      }
    }

    // Update bus
    bus.busName = busName || bus.busName;
    bus.busNumber = busNumber || bus.busNumber;
    bus.route = route || bus.route;
    bus.departureTime = departureTime || bus.departureTime;
    bus.arrivalTime = arrivalTime || bus.arrivalTime;
    bus.operatingDays = operatingDays || bus.operatingDays;
    bus.isActive = isActive !== undefined ? isActive : bus.isActive;

    await bus.save();

    res.json({
      success: true,
      message: 'Bus updated successfully',
      bus
    });
  } catch (error) {
    console.error('Error updating bus:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating bus'
    });
  }
});

// Delete bus (admin only)
router.delete('/buses/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const bus = await Bus.findById(id);
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    await Bus.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Bus deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting bus:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting bus'
    });
  }
});

// Create default admin account (for initial setup)
router.post('/setup', async (req, res) => {
  try {
    // Check if any admin exists
    const adminExists = await Admin.findOne();
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'Admin account already exists'
      });
    }

    // Create default admin
    const admin = new Admin({
      username: 'admin',
      password: 'admin123',
      email: 'admin@perdoor.com'
    });

    await admin.save();

    res.json({
      success: true,
      message: 'Default admin account created',
      credentials: {
        username: 'admin',
        password: 'admin123'
      }
    });
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating admin account'
    });
  }
});

module.exports = router;