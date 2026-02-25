const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getChartData,
  getRecentActivity,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Dashboard routes
router.get('/overview', getDashboardStats);
router.get('/charts', getChartData);
router.get('/activity', getRecentActivity);

module.exports = router;
