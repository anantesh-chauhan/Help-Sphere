const axios = require("axios");

const ipCache = new Map(); // { ip: { data, expiry } }

const getUserLocationByIP = async (req, res) => {
  console.log("Fetching user location...");
  try {
    let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";

    // Extract first IP if multiple
    ip = ip.split(",")[0].trim();

    // Handle localhost IPs
    if (ip === "::1" || ip.startsWith("127.") || ip === "") {
      console.log("⚠️ Localhost detected, using fallback IP");
      ip = "117.98.34.90"; // fallback: Google DNS IP
    }

    // check cache (valid for 1 hour)
    const cached = ipCache.get(ip);
    if (cached && cached.expiry > Date.now()) {
      return res.json(cached.data);
    }

    // call ipapi
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    const { latitude, longitude, city, region, country_name } = response.data;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Could not determine location" });
    }

    const locationData = { latitude, longitude, city, region, country: country_name };

    // cache result for 1 hour
    ipCache.set(ip, { data: locationData, expiry: Date.now() + 60 * 60 * 1000 });

    res.json(locationData);
  } catch (error) {
    console.error("❌ Location error:", error.message);
    res.status(500).json({ error: "Failed to get location by IP" });
  }
};

module.exports = { getUserLocationByIP };
