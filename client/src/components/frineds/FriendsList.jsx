import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { AppContent } from "../../context/AppContext";

export default function FriendsList() {
  const [friends, setFriends] = useState([]);
  const { backendUrl } = useContext(AppContent);
  const defaultAvatar =
    "https://res.cloudinary.com/dlixtmy1x/image/upload/v1755115315/avatar_izmj6c.webp";

  const load = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/friends`, {
        withCredentials: true,
      });
      setFriends(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading friends:", err);
    }
  };

  const removeFriend = async (id) => {
    if (!window.confirm("❌ Are you sure you want to remove this friend?")) return;
    try {
      await axios.delete(`${backendUrl}/api/friends/${id}`, {
        withCredentials: true,
      });
      setFriends((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error("Error removing friend:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  };

  const cardStyle = {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
    padding: "20px",
    textAlign: "center",
    transition: "all 0.3s ease",
  };

  const avatarStyle = {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    marginBottom: "10px",
    objectFit: "cover",
  };

  const buttonStyle = {
    base: {
      padding: "8px 16px",
      borderRadius: "8px",
      color: "#fff",
      border: "none",
      fontSize: "14px",
      cursor: "pointer",
      fontWeight: "600",
      transition: "all 0.2s ease",
    },
    red: { backgroundColor: "#e53935" },
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: "26px", fontWeight: "bold", marginBottom: "24px" }}>
        👥 My Friends
      </h1>

      {friends.length === 0 ? (
        <div style={{ textAlign: "center", padding: "24px", color: "#6b7280", fontSize: "16px" }}>
          You have no friends yet. 😢
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {friends.map((f) => (
            <motion.div
              key={f._id}
              style={cardStyle}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}
            >
              <motion.img
                src={f.avatar || defaultAvatar}
                alt={f.name || "User"}
                style={avatarStyle}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4 }}
              />
              <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>{f.name} 🌟</h2>
              <p style={{ color: "#6b7280", fontSize: "14px" }}>{f.email}</p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "14px",
                  marginTop: "10px",
                  fontSize: "14px",
                  color: "#4b5563",
                }}
              >
                <span>💰 Donations: {f.donations ?? 0}</span>
                <span>🤝 Helps: {f.helpRequests ?? 0}</span>
              </div>

              <div style={{ marginTop: "14px" }}>
                <button
                  onClick={() => removeFriend(f._id)}
                  style={{ ...buttonStyle.base, ...buttonStyle.red }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#d32f2f")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#e53935")}
                >
                  Remove Friend ❌
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
