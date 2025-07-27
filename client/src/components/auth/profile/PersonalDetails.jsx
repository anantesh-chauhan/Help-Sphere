import React, { useEffect, useState, useContext } from 'react';
import { Typography, Box } from '@mui/material';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { AppContent } from '../../../context/AppContext';
import apis from '../../../assets/utils/apis';
import httpAction from '../../../assets/utils/httpAction';

const PersonalDetails = () => {
  const [user, setUser] = useState(null);
  const { handleLogin } = useContext(AppContent);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const data = {
        url: apis().userProfile,
        method: 'GET',
      };

      const result = await httpAction(data);

      if (result?.success && result.user) {
        setUser(result.user);
        handleLogin?.(result.user);
      } else {
        toast.error(result?.message || 'Failed to fetch personal details');
      }
    };

    fetchUserDetails();
  }, []);

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Typography variant="body1">Loading personal details...</Typography>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ p: { xs: 2, sm: 3 }, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>
        <Typography><strong>Name:</strong> {user.name || 'N/A'}</Typography>
        <Typography><strong>Email:</strong> {user.email || 'N/A'}</Typography>
        <Typography><strong>Phone:</strong> {user.phone || 'N/A'}</Typography>
        <Typography><strong>Address:</strong> {user.address || 'N/A'}</Typography>
      </Box>
    </motion.div>
  );
};

export default PersonalDetails;
