import React from 'react';
import Hero from '../Hero';
import DashboardStats from '../overview/DashboardStats';

const Home = () => {
  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        width: '100%',
        margin: 0,       // remove auto margin
        padding: 0,      // remove side padding
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
