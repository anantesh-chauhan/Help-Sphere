import React from 'react';
import MyHelpRequests from './requests/MyHelpRequests';
import RequestHelp from './requests/RequestHelp';
import AllHelpRequests from './requests/AllHelpRequests';
import { Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

const HelpRequest = () => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: '2rem' }}
      >
        <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '1rem' }}>
          🗂️ My Help Requests
        </Typography>
        <MyHelpRequests />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ marginBottom: '2rem' }}
      >
        <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '1rem' }}>
          📢 Request Help
        </Typography>
        <RequestHelp />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        style={{ marginBottom: '2rem' }}
      >
        <Typography variant="h5" style={{ fontWeight: 600, marginBottom: '1rem' }}>
          🌐 All Help Requests
        </Typography>
        <AllHelpRequests />
      </motion.div>
    </div>
  );
};

export default HelpRequest;
