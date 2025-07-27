import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { motion, useAnimation } from 'framer-motion';

const WeatherTicker = () => {
  const [weather, setWeather] = useState(null);
  const [dateTime, setDateTime] = useState('');
  const [error, setError] = useState('');
  const tickerRef = useRef();
  const controls = useAnimation();

  useEffect(() => {
    const fetchWeatherFromIP = async () => {
      try {
        const locationRes = await axios.get('http://localhost:5050/api/location');
        const { latitude, longitude, city } = locationRes.data;

        const weatherRes = await axios.post('http://localhost:5050/api/weather', {
          latitude,
          longitude,
        });

        const data = weatherRes.data;
        setWeather({
          city,
          temp: data.main.temp,
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

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const day = now.toLocaleDateString('en-US', { weekday: 'long' });
      const date = now.toLocaleDateString();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setDateTime(`${day}, ${date} | ${time}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 10000);//
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (tickerRef.current) {
      const contentWidth = tickerRef.current.scrollWidth;
      const containerWidth = window.innerWidth;
      const totalDistance = contentWidth + containerWidth;
      const speed = 50; // pixels per second (adjust this for slower/faster)

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

  if (error) {
    return (
      <div style={{
        backgroundColor: '#ef4444',
        color: '#fff',
        padding: '10px',
        textAlign: 'center',
        fontFamily: 'Segoe UI, Roboto, sans-serif',
        fontWeight: 600,
        fontSize: '1rem',
      }}>
        {error}
      </div>
    );
  }

  if (!weather) {
    return (
      <div style={{
        padding: '10px',
        textAlign: 'center',
        fontFamily: 'Segoe UI, Roboto, sans-serif',
        fontSize: '1rem',
        color: '#555'
      }}>
        Loading weather...
      </div>
    );
  }

  const singleMessage = `📅 ${dateTime} | 📍 ${weather.city} | 🌤 ${weather.temp}°C, ${weather.condition} | 💧 ${weather.humidity}% | 🌬 ${weather.wind} m/s`;
  const message = Array(10).fill(singleMessage).join('   ⬩   ');

  return (
    <div
      style={{
        width: '100vw',
        overflow: 'hidden',
        background: '#F5EFFF',
        // color: '#000',
        padding: '14px 0',
        fontSize: '1.1rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        fontFamily: 'Segoe UI, Roboto, sans-serif',
        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
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
