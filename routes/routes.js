const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');

// Search routes by name
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const routes = await Bus.distinct('route', {
      route: new RegExp(query, 'i'),
      isActive: true
    });

    res.json({
      success: true,
      query,
      routes: routes.sort()
    });
  } catch (error) {
    console.error('Error searching routes:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching routes',
      error: error.message
    });
  }
});

// Get popular routes
router.get('/popular', async (req, res) => {
  try {
    // Get routes with most buses (indicating popularity)
    const popularRoutes = await Bus.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$route', busCount: { $sum: 1 } } },
      { $sort: { busCount: -1 } },
      { $limit: 5 },
      { $project: { route: '$_id', busCount: 1, _id: 0 } }
    ]);

    res.json({
      success: true,
      popularRoutes
    });
  } catch (error) {
    console.error('Error fetching popular routes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching popular routes',
      error: error.message
    });
  }
});

module.exports = router;