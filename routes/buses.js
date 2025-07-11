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
        busName: "KG Road Express",
        busNumber: "KA-20-1001",
        route: "KG Road",
        departureTime: "06:00",
        arrivalTime: "06:45"
      },
      {
        busName: "KG Road Fast",
        busNumber: "KA-20-1002",
        route: "KG Road",
        departureTime: "08:30",
        arrivalTime: "09:15"
      },
      {
        busName: "KG Road Service",
        busNumber: "KA-20-1003",
        route: "KG Road",
        departureTime: "16:00",
        arrivalTime: "16:45"
      },
      {
        busName: "Bramavara Express",
        busNumber: "KA-20-2001",
        route: "Bramavara",
        departureTime: "07:00",
        arrivalTime: "08:00"
      },
      {
        busName: "Bramavara Local",
        busNumber: "KA-20-2002",
        route: "Bramavara",
        departureTime: "14:30",
        arrivalTime: "15:30"
      },
      {
        busName: "Bramavara Evening",
        busNumber: "KA-20-2003",
        route: "Bramavara",
        departureTime: "18:00",
        arrivalTime: "19:00"
      },
      {
        busName: "Hebri Express",
        busNumber: "KA-20-3001",
        route: "Hebri",
        departureTime: "06:30",
        arrivalTime: "07:45"
      },
      {
        busName: "Hebri Fast",
        busNumber: "KA-20-3002",
        route: "Hebri",
        departureTime: "12:00",
        arrivalTime: "13:15"
      },
      {
        busName: "Hebri Night",
        busNumber: "KA-20-3003",
        route: "Hebri",
        departureTime: "20:30",
        arrivalTime: "21:45"
      },
      {
        busName: "Manipal Express",
        busNumber: "KA-20-4001",
        route: "Manipal",
        departureTime: "05:45",
        arrivalTime: "07:30"
      },
      {
        busName: "Manipal Student Special",
        busNumber: "KA-20-4002",
        route: "Manipal",
        departureTime: "08:00",
        arrivalTime: "09:45"
      },
      {
        busName: "Manipal Evening",
        busNumber: "KA-20-4003",
        route: "Manipal",
        departureTime: "15:30",
        arrivalTime: "17:15"
      },
      {
        busName: "Manipal Late Night",
        busNumber: "KA-20-4004",
        route: "Manipal",
        departureTime: "22:00",
        arrivalTime: "23:45"
      },
      {
        busName: "Ajekar Express",
        busNumber: "KA-20-5001",
        route: "Ajekar",
        departureTime: "07:15",
        arrivalTime: "08:30"
      },
      {
        busName: "Ajekar Local",
        busNumber: "KA-20-5002",
        route: "Ajekar",
        departureTime: "13:45",
        arrivalTime: "15:00"
      },
      {
        busName: "Ajekar Evening",
        busNumber: "KA-20-5003",
        route: "Ajekar",
        departureTime: "17:30",
        arrivalTime: "18:45"
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