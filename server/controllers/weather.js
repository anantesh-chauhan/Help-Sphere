const axios = require('axios');
const { getWeatherURL } = require('../utils/openWeather');


const getWeatherByCoordinates = async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and Longitude are required' });
  }

  try {
    const url = getWeatherURL(latitude, longitude);
    const response = await axios.get(url);
    return res.json(response.data);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'Failed to fetch weather data from OpenWeatherMap' });
  }
};

module.exports = {
  getWeatherByCoordinates,
};
