import React from 'react';
import AllReviews from './AllReviews';
import Reviews from '../auth/profile/Reviews';
import { motion } from 'framer-motion';

const Review = () => {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Segoe UI, Roboto, sans-serif',
      }}
    >
      {/* Page Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          fontSize: '2rem',
          textAlign: 'center',
          marginBottom: '20px',
          color: '#4B0082',
        }}
      >
        📝 Reviews & Feedback
      </motion.h1>

      {/* User's Personal Reviews Section */}
      <div
        style={{
          marginBottom: '30px',
          padding: '16px',
          border: '1px solid #ddd',
          borderRadius: '12px',
          backgroundColor: '#f0f8ff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <h2
          style={{
            fontSize: '1.4rem',
            marginBottom: '12px',
            color: '#333',
          }}
        >
          👤 Your Reviews
        </h2>
        <Reviews />
      </div>

      {/* All Reviews Section */}
      <div
        style={{
          padding: '16px',
          border: '1px solid #ddd',
          borderRadius: '12px',
          backgroundColor: '#fffaf0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        <h2
          style={{
            fontSize: '1.4rem',
            marginBottom: '12px',
            color: '#333',
          }}
        >
          🌟 Community Reviews
        </h2>
        <AllReviews />
      </div>
    </div>
  );
};

export default Review;
