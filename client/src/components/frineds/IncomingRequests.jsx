import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { AppContent } from "../../context/AppContext";

export default function IncomingRequests() {
  const [requests, setRequests] = useState([]);
  const { backendUrl } = useContext(AppContent);
  const defaultAvatar =
    "https://res.cloudinary.com/dlixtmy1x/image/upload/v1755115315/avatar_izmj6c.webp";

  const load = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/friends/incoming`, {
        withCredentials: true,
      });
      setRequests(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading requests:", err);
    }
  };

  const accept = async (id) => {
    await axios.post(`${backendUrl}/api/friends/accept/${id}`, {}, { withCredentials: true });
    setRequests((prev) => prev.filter((r) => r._id !== id));
  };

  const reject = async (id) => {
    await axios.post(`${backendUrl}/api/friends/reject/${id}`, {}, { withCredentials: true });
    setRequests((prev) => prev.filter((r) => r._id !== id));
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
    green: { backgroundColor: "#4caf50" },
    red: { backgroundColor: "#e53935" },
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: "26px", fontWeight: "bold", marginBottom: "24px" }}>
        📥 Incoming Friend Requests
      </h1>

      {requests.length === 0 ? (
        <div style={{ textAlign: "center", padding: "24px", color: "#6b7280", fontSize: "16px" }}>
          You have no incoming friend requests. 😌
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {requests.map((r) => (
            <motion.div
              key={r._id}
              style={cardStyle}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}
            >
              <motion.img
                src={r.from?.avatar || defaultAvatar}
                alt={r.from?.name || "User"}
                style={avatarStyle}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4 }}
              />
              <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>{r.from?.name} 🌟</h2>
              <p style={{ color: "#6b7280", fontSize: "14px" }}>{r.from?.email}</p>

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
                <span>💰 Donations: {r.from?.donations ?? 0}</span>
                <span>🤝 Helps: {r.from?.helpRequests ?? 0}</span>
              </div>

              <div
                style={{
                  marginTop: "14px",
                  display: "flex",
                  gap: "12px",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={() => accept(r._id)}
                  style={{ ...buttonStyle.base, ...buttonStyle.green }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#43a047")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#4caf50")}
                >
                  Accept ✅
                </button>
                <button
                  onClick={() => reject(r._id)}
                  style={{ ...buttonStyle.base, ...buttonStyle.red }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#d32f2f")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#e53935")}
                >
                  Reject ❌
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
