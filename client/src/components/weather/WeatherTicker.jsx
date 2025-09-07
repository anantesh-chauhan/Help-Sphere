import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { motion, useAnimation } from 'framer-motion';
import { AppContent } from '../../context/AppContext';
const WeatherTicker = () => {
  const [weather, setWeather] = useState(null);
  const [dateTime, setDateTime] = useState('');
  const [error, setError] = useState('');
  const tickerRef = useRef();
  const controls = useAnimation();
  const {backendUrl} = useContext(AppContent);
  // Fetch weather
  useEffect(() => {
    const fetchWeatherFromIP = async () => {
      try {
        const locationRes = await axios.get(`${backendUrl}/api/location`);
        const { latitude, longitude, city } = locationRes.data;

        const weatherRes = await axios.post(`${backendUrl}/api/weather`, {
          latitude,
          longitude,
        });

        const data = weatherRes.data;
        setWeather({
          city,
          temp: Math.round(data.main.temp),
          condition: data.weather[0].description,
          humidity: data.main.humidity,
          wind: data.wind.speed,
        });
      } catch (err) {
        console.error(err);
        setError('❌ Failed to load weather data');
      }
    };
    fetchWeatherFromIP();
  }, []);

  // Update date/time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const day = now.toLocaleDateString('en-US', { weekday: 'long' });
      const date = now.toLocaleDateString();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setDateTime(`${day}, ${date} | ${time}`);
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Animate ticker
  useEffect(() => {
    if (tickerRef.current && weather) {
      const contentWidth = tickerRef.current.scrollWidth;
      const containerWidth = window.innerWidth;
      const totalDistance = contentWidth + containerWidth;
      const speed = 50; // pixels per second

      controls.start({
        x: [-containerWidth, -contentWidth],
        transition: {
          repeat: Infinity,
          ease: 'linear',
          duration: totalDistance / speed,
        },
      });
    }
  }, [weather, dateTime]);

  // Error or loading states
  if (error) {
    return (
      <div
        style={{
          width: '100%',
          textAlign: 'center',
          padding: '12px 0',
          backgroundColor: '#ef4444',
          color: '#fff',
          fontFamily: 'Segoe UI, Roboto, sans-serif',
          fontWeight: 600,
          fontSize: '1rem',
        }}
      >
        {error}
      </div>
    );
  }

  if (!weather) {
    return (
      <div
        style={{
          width: '100%',
          textAlign: 'center',
          padding: '12px 0',
          fontFamily: 'Segoe UI, Roboto, sans-serif',
          fontSize: '1rem',
          color: '#555',
        }}
      >
        ⏳ Loading weather...
      </div>
    );
  }

  // Construct message
  const singleMessage = `${dateTime} | 📍 ${weather.city} | ☀️ ${weather.temp}°C | 🌤 ${weather.condition} | 💧 ${weather.humidity}% | 🌬 ${weather.wind} m/s`;
  const message = Array(10).fill(singleMessage).join('   🌟🌟🌟   ');

  return (
    <div
      style={{
        width: '100%',
        overflow: 'hidden',
        padding: '12px 8px',
        fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        fontFamily: 'Segoe UI, Roboto, sans-serif',
        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
        background: 'linear-gradient(to right, #A2AADB, #E0C3FC)',
      }}
    >
      <motion.div
        ref={tickerRef}
        style={{ display: 'inline-block' }}
        animate={controls}
      >
        {message}
      </motion.div>
    </div>
  );
};

export default WeatherTicker;
