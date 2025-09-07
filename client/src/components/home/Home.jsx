import React from 'react';
import Hero from '../Hero';
import DashboardStats from '../overview/DashboardStats';
import YogaHealix from './YogaHealix';

const Home = () => {
  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        width: '100%',
        margin: 0,
        padding: 0,
      }}
    >
      {/* Hero Section */}
      <div style={{ width: '100%' }}>
        <Hero />
      </div>

      {/* Dashboard Stats */}
      <div style={{ marginTop: '40px', width: '100%' }}>
        <DashboardStats />
      </div >

      <div style={{ marginTop: '40px', width: '100%' }}>
        <YogaHealix />
      </div>

      </div>
  );
};

export default Home;
