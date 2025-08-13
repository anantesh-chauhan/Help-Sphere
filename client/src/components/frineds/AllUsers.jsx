import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { AppContent } from "../../context/AppContext";

export default function AllUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { backendUrl } = useContext(AppContent);
  const defaultAvatar =
    "https://res.cloudinary.com/dlixtmy1x/image/upload/v1755115315/avatar_izmj6c.webp";

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/friends/users`, {
        withCredentials: true,
      });
      setUsers(Array.isArray(res.data) ? res.data : res.data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (id) => {
    try {
      await axios.post(
        `${backendUrl}/api/friends/request`,
        { toUserId: id },
        { withCredentials: true }
      );
      fetchUsers();
    } catch (err) {
      console.error("Error sending request:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <motion.div
        style={{
          textAlign: "center",
          padding: "40px",
          fontSize: "1.2rem",
          color: "#555",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        ⏳ Loading users...
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{
        maxWidth: "1100px",
        margin: "auto",
        padding: "20px",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        👥 All Users
      </h1>
      <motion.div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "20px",
        }}
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.15 } },
        }}
      >
        {users.map((user) => (
          <motion.div
            key={user._id}
            style={{
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
              padding: "20px",
              textAlign: "center",
            }}
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ scale: 1.03 }}
          >
            <img
              src={user.avatar || defaultAvatar}
              alt={user.name || "User"}
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "10px",
              }}
            />
            <h2
              style={{
                fontSize: "1.2rem",
                fontWeight: "600",
                marginTop: "5px",
              }}
            >
              {user.name} {user.friendStatus === "friend" && "💙"}
            </h2>
            <p style={{ fontSize: "0.9rem", color: "#666" }}>📧 {user.email}</p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginTop: "8px",
                fontSize: "0.9rem",
                color: "#555",
              }}
            >
              <span>💰 Donations: {user.donations ?? 0}</span>
              <span>👐 Helps: {user.helpRequests ?? 0}</span>
            </div>

            <div style={{ marginTop: "15px" }}>
              {user.friendStatus === "not_friend" && (
                <motion.button
                  style={{
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "#28a745",
                  }}
                  onClick={() => sendFriendRequest(user._id)}
                  whileHover={{ scale: 1.05, backgroundColor: "#218838" }}
                  whileTap={{ scale: 0.95 }}
                >
                  ➕ Add Friend
                </motion.button>
              )}
              {user.friendStatus === "pending" && (
                <motion.span
                  style={{
                    padding: "5px 12px",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    fontSize: "0.85rem",
                    backgroundColor: "#ffc107",
                    color: "white",
                    display: "inline-block",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  ⏳ Pending
                </motion.span>
              )}
              {user.friendStatus === "friend" && (
                <motion.span
                  style={{
                    padding: "5px 12px",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    fontSize: "0.85rem",
                    backgroundColor: "#007bff",
                    color: "white",
                    display: "inline-block",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  💖 Friends
                </motion.span>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
