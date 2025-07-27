import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Typography, Box } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import apis from '../../../assets/utils/apis';
import httpAction from '../../../assets/utils/httpAction';
import { AppContent } from '../../../context/AppContext';

const BasicInfo = () => {
  const [user, setUser] = useState(null);
  const { handleLogin } = useContext(AppContent);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const data = {
        url: apis().userProfile,
        method: 'GET',
      };

      const result = await httpAction(data);

      if (result?.success && result.user) {
        handleLogin(result.user);
        setUser(result.user);
      } else {
        toast.error(result?.message || 'Session expired');
        navigate('/login');
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{ textAlign: 'center', padding: '16px' }}
      >
        <Typography>Loading user info...</Typography>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Box
        display="flex"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        sx={{ mb: 3 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: '#4caf50',
              fontSize: '28px',
            }}
          >
            {user.name?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Typography variant="h5" sx={{ mb: 0 }}>
            {user.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {user.email}
          </Typography>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default BasicInfo;
