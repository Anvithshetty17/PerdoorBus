const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');
const moment = require('moment');

// Get all buses for a specific route
router.get('/route/:routeName', async (req, res) => {
  try {
    const { routeName } = req.params;
    const buses = await Bus.find({ 
      route: new RegExp(routeName, 'i'),
      isActive: true 
    }).sort({ departureTime: 1 });

    // Calculate next upcoming buses
    const now = moment();
    const currentTime = now.format('HH:mm');
    const currentDay = now.format('dddd');

    const upcomingBuses = buses.filter(bus => {
      // Check if bus operates today
      if (!bus.operatingDays.includes('Daily') && !bus.operatingDays.includes(currentDay)) {
        return false;
      }

      // Check if departure time hasn't passed
      if (bus.departureTime > currentTime) {
        const [hours, minutes] = bus.departureTime.split(':').map(Number);
        const busTime = moment().hours(hours).minutes(minutes).seconds(0);
        bus._doc.nextDeparture = bus.departureTime;
        bus._doc.timeUntilDeparture = busTime.diff(now, 'minutes');
        return true;
      }
      return false;
    });

    // Sort by next departure time
    upcomingBuses.sort((a, b) => a.timeUntilDeparture - b.timeUntilDeparture);

    res.json({
      success: true,
      route: routeName,
      totalBuses: buses.length,
      upcomingBuses: upcomingBuses.slice(0, 10), // Show next 10 buses
      currentTime: now.format('HH:mm'),
      currentDate: now.format('YYYY-MM-DD')
    });
  } catch (error) {
    console.error('Error fetching buses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bus information',
      error: error.message
    });
  }
});

// Get all available routes
router.get('/routes', async (req, res) => {
  try {
    const routes = await Bus.distinct('route', { isActive: true });
    res.json({
      success: true,
      routes: routes.sort()
    });
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching routes',
      error: error.message
    });
  }
});

// Add a new bus (for admin)
router.post('/', async (req, res) => {
  try {
    const bus = new Bus(req.body);
    await bus.save();
    res.status(201).json({
      success: true,
      message: 'Bus added successfully',
      bus
    });
  } catch (error) {
    console.error('Error adding bus:', error);
    res.status(400).json({
      success: false,
      message: 'Error adding bus',
      error: error.message
    });
  }
});

// Add sample bus data (for initial setup)
router.post('/seed', async (req, res) => {
  try {
    const sampleBuses = [
      {
        busName: "Perdoor Express",
        busNumber: "KL-01-1234",
        route: "Thiruvananthapuram",
        departureTime: "06:00",
        arrivalTime: "09:30"
      },
      {
        busName: "City Link",
        busNumber: "KL-01-1235",
        route: "Kottayam",
        departureTime: "07:15",
        arrivalTime: "09:30"
      },
      {
        busName: "Super Fast",
        busNumber: "KL-01-1236",
        route: "Ernakulam",
        departureTime: "08:30",
        arrivalTime: "12:30"
      },
      {
        busName: "Night Rider",
        busNumber: "KL-01-1237",
        route: "Thiruvananthapuram",
        departureTime: "22:00",
        arrivalTime: "01:15"
      },
      {
        busName: "Morning Glory",
        busNumber: "KL-01-1238",
        route: "Kollam",
        departureTime: "05:45",
        arrivalTime: "07:30"
      },
      {
        busName: "Evening Express",
        busNumber: "KL-01-1239",
        route: "Thiruvananthapuram",
        departureTime: "16:00",
        arrivalTime: "19:30"
      },
      {
        busName: "Afternoon Service",
        busNumber: "KL-01-1240",
        route: "Kottayam",
        departureTime: "14:30",
        arrivalTime: "16:45"
      }
    ];

    await Bus.deleteMany({}); // Clear existing data
    await Bus.insertMany(sampleBuses);

    res.json({
      success: true,
      message: `${sampleBuses.length} sample buses added successfully`
    });
  } catch (error) {
    console.error('Error seeding bus data:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding bus data',
      error: error.message
    });
  }
});

module.exports = router;