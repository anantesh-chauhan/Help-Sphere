import React from 'react';
import { Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

const Claims = () => {
  const claims = [
    { id: 1, date: '2025-06-01', status: 'Approved' },
    { id: 2, date: '2025-06-10', status: 'Pending' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ padding: '16px', backgroundColor: '#f0f7ff', borderRadius: '12px' }}
    >
      <Typography variant="h5" style={{ marginBottom: '1rem', fontWeight: 600 }}>
        📝 Your Claims
      </Typography>

      <Box component="ul" sx={{ paddingLeft: '1rem', margin: 0 }}>
        {claims.map((claim) => (
          <Box
            component="li"
            key={claim.id}
            sx={{
              marginBottom: '0.8rem',
              padding: '8px 12px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            }}
          >
            <Typography>
              📅 <strong>Date:</strong> {claim.date} — 
              {claim.status === 'Approved' ? ' ✅' : ' ⏳'} <strong>Status:</strong> {claim.status}
            </Typography>
          </Box>
        ))}
      </Box>
    </motion.div>
  );
};

export default Claims;
