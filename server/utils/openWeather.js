const getWeatherURL = (lat, lon) => {
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
};

module.exports = {
  getWeatherURL,
};
