const axios = require('axios');

const getUserLocationByIP = async (req, res) => {
  try {
    // You can hardcode for local testing or use req.ip/x-forwarded-for
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const response = await axios.get(`https://ipapi.co/json/`); // auto-detects IP

    const { latitude, longitude, city, region, country_name } = response.data;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Could not determine location' });
    }

    res.json({
      latitude,
      longitude,
      city,
      region,
      country: country_name,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to get location by IP' });
  }
};

module.exports = {
  getUserLocationByIP,
};
