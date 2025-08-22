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
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import httpAction from '../../assets/utils/httpAction';
import apis from '../../assets/utils/apis';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 },
  }),
};

const chartVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
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

  // -------------------
  // Chart Data
  // -------------------
  const barData = {
    labels: ['Users', 'Requests', 'Donations', 'Reviews', 'NGOs', 'Bugs', 'Help Offers'],
    datasets: [
      {
        label: 'Platform Stats',
        data: [
          stats.totalUsers,
          stats.totalRequests,
          stats.totalDonations,
          stats.totalReviews,
          stats.activeNGOs,
          stats.bugReports,
          stats.helpOffers,
        ],
        backgroundColor: '#7b1fa2',
      },
    ],
  };

  const pieData = {
    labels: ['Requests', 'Donations', 'Reviews', 'Help Offers'],
    datasets: [
      {
        data: [stats.totalRequests, stats.totalDonations, stats.totalReviews, stats.helpOffers],
        backgroundColor: ['#1cc88a', '#36b9cc', '#f6c23e', '#ff6384'],
        hoverOffset: 10,
      },
    ],
  };

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'User Growth',
        data: [10, 20, 35, 50, 65, stats.totalUsers || 0],
        borderColor: '#4e73df',
        backgroundColor: '#4e73df33',
        tension: 0.4,
        fill: true,
      },
    ],
  };

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

      {/* Stats Cards */}
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

      {/* Charts Title */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: '#311b92',
          textAlign: 'center',
          my: 3,
        }}
      >
        Visual Stats
      </Typography>

      {/* Charts */}
      {/* Charts */}
<Grid
  container
  spacing={3}
  sx={{
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, // 1 in row on small, 2 in row on large
    gap: 3,
  }}
>
  {[{ title: 'Activity Bar Chart', data: barData, type: 'bar' },
    { title: 'Activity Pie Chart', data: pieData, type: 'pie' },
    { title: 'User Growth Line', data: lineData, type: 'line' }].map(
    (chart, idx) => (
      <motion.div
        key={idx}
        variants={chartVariants}
        initial="hidden"
        animate="visible"
      >
        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            boxShadow: 3,
            backgroundColor: '#fff',
            height: 250,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 1,
              fontWeight: 'bold',
              color: '#311b92',
              textAlign: 'center',
            }}
          >
            {chart.title}
          </Typography>
          <Box sx={{ flex: 1, width: '100%' }}>
            {chart.type === 'bar' && <Bar data={chart.data} options={{ responsive: true, maintainAspectRatio: false }} />}
            {chart.type === 'pie' && <Pie data={chart.data} options={{ responsive: true, maintainAspectRatio: false }} />}
            {chart.type === 'line' && <Line data={chart.data} options={{ responsive: true, maintainAspectRatio: false }} />}
          </Box>
        </Paper>
      </motion.div>
    )
  )}
</Grid>

    </Box>
  );
};

export default DashboardStats;
