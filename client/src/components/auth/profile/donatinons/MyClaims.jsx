import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { AppContent } from "../../../../context/AppContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.2 } 
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const MyClaims = () => {
  const { userData, backendUrl } = useContext(AppContent);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/items/my-claims/${userData._id}`);
      setClaims(res.data);
    } catch (err) {
      toast.error("❌ Failed to fetch claimed items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchClaims();
    }
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "1.2rem", color: "#666" }}>
        ⏳ Loading your claims...
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "auto",
        backgroundColor: "#f0fdf4",
        borderRadius: "10px",
      }}
    >
      <h2
        style={{
          fontSize: "1.8rem",
          fontWeight: "bold",
          marginBottom: "20px",
          textAlign: "center",
          color: "#15803d",
        }}
      >
        📦 My Claimed Donations
      </h2>

      {claims.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666", fontSize: "1rem" }}>
          😔 You haven't claimed any items yet.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {claims.map((item) => (
            <motion.div
              key={item._id}
              variants={cardVariants}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "10px",
                background: "#fff",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.05)",
                transition: "transform 0.2s",
              }}
              whileHover={{ scale: 1.03 }}
            >
              <img
                src={item.imageUrls[0]}
                alt={item.title}
                className="w-full object-contain rounded-md mb-3 bg-gray-100"
                style={{ height: "250px" }}
              />
              <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "5px" }}>
                🎁 {item.title}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#555", marginBottom: "5px" }}>
                {item.description}
              </p>
              <p style={{ fontSize: "0.85rem", color: "#444" }}>
                🏷 Category: {item.category}
              </p>
              <p style={{ fontSize: "0.75rem", color: "#777", marginTop: "8px" }}>
                📅 Claimed on: {new Date(item.claimedAt).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MyClaims;
