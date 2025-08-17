import React, { useContext, useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { AppContent } from "../../../context/AppContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const UserDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { backendUrl } = useContext(AppContent);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${backendUrl}/user/stats`, { withCredentials: true });
        setStats(res.data.stats);
      } catch (err) {
        console.error("Error fetching user dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [backendUrl]);

  if (loading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>;
  if (!stats) return <p style={{ textAlign: "center", marginTop: "2rem" }}>No data available</p>;

  const barData = {
    labels: ["Requests", "Donations", "Reviews", "Help Offers"],
    datasets: [
      {
        label: "Your Activity",
        data: [stats.myRequests, stats.myDonations, stats.myReviews, stats.myHelpOffers],
        backgroundColor: ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e"],
      },
    ],
  };

  const pieData = {
    labels: ["Requests", "Donations", "Reviews", "Help Offers"],
    datasets: [
      {
        data: [stats.myRequests, stats.myDonations, stats.myReviews, stats.myHelpOffers],
        backgroundColor: ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e"],
        hoverOffset: 10,
      },
    ],
  };

  const chartVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <motion.h2
        style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem", textAlign: "center" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Your Stats
      </motion.h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
        }}
      >
        <motion.div
          style={{
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
          }}
          variants={chartVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Activity Bar Chart</h3>
          <Bar data={barData} options={{ responsive: true }} />
        </motion.div>

        <motion.div
          style={{
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
          }}
          variants={chartVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Activity Pie Chart</h3>
          <Pie data={pieData} options={{ responsive: true }} />
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;
