// routes/dashboard.js
const express = require('express');
const { getDashboardStats } = require('../controllers/dashboardStats');
const router = express.Router();

router.get('/stats', getDashboardStats);

module.exports = router;
