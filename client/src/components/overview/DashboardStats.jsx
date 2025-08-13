import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import httpAction from '../../assets/utils/httpAction';
import apis from '../../assets/utils/apis';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 },
  }),
};

const DashboardStats = () => {
  const [stats, setStats] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchStats = async () => {
      const result = await httpAction({
        url: apis().dashboardStats,
        method: 'GET',
      });
      if (result.success) setStats(result.stats);
    };
    fetchStats();
  }, []);

  const statItems = [
    { label: '👥 Total Users', value: stats.totalUsers },
    { label: '🆘 Total Help-Requests', value: stats.totalRequests },
    { label: '💝 Total Donations', value: stats.totalDonations },
    { label: '⭐ Total Reviews', value: stats.totalReviews },
    { label: '🏢 Active NGOs', value: stats.activeNGOs },
    { label: '🐞 Bug Reports', value: stats.bugReports },
    { label: '🤝 Help Offers', value: stats.helpOffers },
  ];

  return (
    <Box sx={{ p: isMobile ? 2 : 4, backgroundColor: '#f3e5f5' }}>
      <Typography
        variant="h5"
        sx={{
          textAlign: 'center',
          mb: 3,
          fontWeight: 'bold',
          color: '#5e35b1',
        }}
      >
        📊 Platform Overview
      </Typography>

      <Grid
        container
        spacing={3}
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
          gap: 3,
        }}
      >
        {statItems.map((item, i) => (
          <Grid item xs={12} sm={6} md={4} key={item.label}>
            <motion.div
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Paper
                elevation={4}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 3,
                  minHeight: '180px',
                  borderRadius: 3,
                  backgroundColor: '#ede7f6',
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: '#311b92' }}
                >
                  {item.label}
                </Typography>
                <Typography
                  variant="h3"
                  sx={{ mt: 1, fontWeight: 700, color: '#7b1fa2' }}
                >
                  {item.value ?? '...'}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardStats;
