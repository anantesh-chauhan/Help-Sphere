import React, { useContext } from 'react';
import { Button } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppContent } from '../../../context/AppContext';
import apis from '../../../assets/utils/apis';
import httpAction from '../../../assets/utils/httpAction';
import { motion } from 'framer-motion';

const LogoutButton = ({ fullWidth = true }) => {
  const { setLogout } = useContext(AppContent);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await httpAction({ url: apis().logout, method: 'GET' });

    if (result?.success) {
      setLogout?.();
      toast.success('👋 Logged out successfully');
      navigate('/login');
    } else {
      toast.error(result?.message || 'Logout failed ❌');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ maxWidth: fullWidth ? '100%' : '200px', margin: '0 auto' }}
    >
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button
          variant="contained"
          style={{
            backgroundColor: '#eba645',
            color: 'white',
          }}
          onClick={handleLogout}
          endIcon={<Logout />}
          fullWidth={fullWidth}
          sx={{
            padding: '10px 20px',
            fontWeight: 600,
            textTransform: 'capitalize',
            fontSize: '1rem',
          }}
        >
          🚪 Logout
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default LogoutButton;
