import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Button } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import apis from '../../assets/utils/apis';
import httpAction from '../../assets/utils/httpAction';
import { toast } from 'react-toastify';
import { AppContent } from '../../context/AppContext';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { setLogout, handleLogin } = useContext(AppContent);

  useEffect(() => {
    const getUser = async () => {
      const data = {
        url: apis().userProfile,
        method: 'GET',
      };

      const result = await httpAction(data);

      if (result?.success && result.user) {
        handleLogin(result.user); // update global context
        setUser(result.user);     // update local state
      } else {
        toast.error(result?.message || 'Session expired');
        navigate('/login');
      }
    };

    getUser();
  }, [handleLogin, navigate]);

  const handleLogoutClick = async () => {
    const result = await httpAction({ url: apis().logout, method: 'GET' });

    if (result?.success) {
      toast.success('Logged out successfully');
      setLogout?.();
      navigate('/login');
    } else {
      toast.error(result?.message || 'Logout failed');
    }
  };

  if (!user) {
    return (
      <div className="auth_card">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="auth_card">
      <div className="profile_container" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Avatar
          sx={{ backgroundColor: '#1976d2', width: 64, height: 64, margin: '0 auto', textTransform: 'capitalize' }}
        >
          {user.name?.charAt(0)?.toUpperCase() || 'U'}
        </Avatar>
        <h2 style={{ marginTop: '10px' }}>{user.name}</h2>
        <p style={{ color: '#555' }}>{user.email}</p>
      </div>

      <div className="action">
        <Button
          variant="contained"
          color="primary"
          fullWidth
          endIcon={<Logout />}
          onClick={handleLogoutClick}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Profile;
