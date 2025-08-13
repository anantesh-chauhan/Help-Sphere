import React from 'react';
import { motion } from 'framer-motion';

const Achievements = () => {
  const badges = [
    { id: 1, label: 'Top Donor', description: 'Donated more than 10 times' },
    { id: 2, label: 'Reviewer Pro', description: 'Wrote 100+ reviews' },
    { id: 3, label: 'Verified Helper', description: 'Verified by NGO team' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ marginBottom: '16px' }}>Your Achievements</h3>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {badges.map((badge) => (
          <motion.div
            key={badge.id}
            whileHover={{ scale: 1.05, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
            transition={{ duration: 0.2 }}
            style={{
              border: '1px solid #ccc',
              padding: '12px',
              borderRadius: '8px',
              minWidth: '120px',
              backgroundColor: '#fff',
              cursor: 'default',
            }}
          >
            <strong style={{ display: 'block', marginBottom: '6px' }}>{badge.label}</strong>
            <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>{badge.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
