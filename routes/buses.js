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

      // If bus has frequency, calculate next departure
      if (bus.frequency) {
        const [hours, minutes] = bus.departureTime.split(':').map(Number);
        let busTime = moment().hours(hours).minutes(minutes).seconds(0);
        
        // Find next occurrence based on frequency
        while (busTime.isBefore(now)) {
          busTime.add(bus.frequency, 'minutes');
        }
        
        // Add calculated next time to bus object
        bus._doc.nextDeparture = busTime.format('HH:mm');
        bus._doc.timeUntilDeparture = busTime.diff(now, 'minutes');
        return true;
      } else {
        // For single-time buses, check if time hasn't passed
        if (bus.departureTime > currentTime) {
          const [hours, minutes] = bus.departureTime.split(':').map(Number);
          const busTime = moment().hours(hours).minutes(minutes).seconds(0);
          bus._doc.nextDeparture = bus.departureTime;
          bus._doc.timeUntilDeparture = busTime.diff(now, 'minutes');
          return true;
        }
        return false;
      }
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
        busType: "Deluxe",
        fare: 150,
        duration: "3h 30m",
        frequency: 60
      },
      {
        busName: "City Link",
        busNumber: "KL-01-1235",
        route: "Kottayam",
        departureTime: "07:15",
        busType: "Ordinary",
        fare: 80,
        duration: "2h 15m"
      },
      {
        busName: "Super Fast",
        busNumber: "KL-01-1236",
        route: "Ernakulam",
        departureTime: "08:30",
        busType: "AC",
        fare: 200,
        duration: "4h 00m",
        frequency: 90
      },
      {
        busName: "Night Rider",
        busNumber: "KL-01-1237",
        route: "Thiruvananthapuram",
        departureTime: "22:00",
        busType: "Volvo",
        fare: 250,
        duration: "3h 15m"
      },
      {
        busName: "Morning Glory",
        busNumber: "KL-01-1238",
        route: "Kollam",
        departureTime: "05:45",
        busType: "Ordinary",
        fare: 60,
        duration: "1h 45m",
        frequency: 45
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