const express = require('express');
const { getWeatherByCoordinates } = require('../controllers/weather');


const router = express.Router();

// POST /api/weather
router.post('/', getWeatherByCoordinates);

module.exports = router;
