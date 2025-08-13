import React from 'react';
import Hero from '../Hero';
import DashboardStats from '../overview/DashboardStats';

const Home = () => {
  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        padding: '0 5%',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      {/* Hero Section */}
      <div style={{ width: '100%' }}>
        <Hero />
      </div>

      {/* Dashboard Stats */}
      <div style={{ marginTop: '40px', width: '100%' }}>
        <DashboardStats />
      </div>
    </div>
  );
};

export default Home;
