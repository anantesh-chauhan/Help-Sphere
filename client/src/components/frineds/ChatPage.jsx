import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import { AppContent } from "../../context/AppContext";

const styles = {
  container: {
    display: "flex",
    height: "90vh",
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden",
    fontFamily: "Arial, sans-serif",
  },
  sidebar: {
    width: "300px",
    borderRight: "1px solid #ddd",
    backgroundColor: "#fafafa",
    overflowY: "auto",
  },
  sidebarHeader: {
    padding: "16px",
    fontSize: "18px",
    fontWeight: "bold",
    borderBottom: "1px solid #ddd",
  },
  friendItem: {
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    gap: "10px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  chatWindow: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  chatHeader: {
    padding: "16px",
    borderBottom: "1px solid #ddd",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  messages: {
    flex: 1,
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    overflowY: "auto",
    backgroundColor: "#ECE5DD",
  },
  message: {
    maxWidth: "60%",
    padding: "10px",
    borderRadius: "8px",
    position: "relative",
    fontSize: "14px",
  },
  timestamp: {
    fontSize: "10px",
    color: "#555",
    marginTop: "4px",
    textAlign: "right",
  },
  inputBox: {
    display: "flex",
    borderTop: "1px solid #ddd",
    padding: "10px",
    backgroundColor: "#f9f9f9",
  },
  input: {
    flex: 1,
    border: "1px solid #ddd",
    borderRadius: "20px",
    padding: "8px 12px",
    fontSize: "14px",
  },
  sendButton: {
    marginLeft: "8px",
    padding: "8px 16px",
    border: "none",
    borderRadius: "50%",
    backgroundColor: "#25D366",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
  },
  emptyState: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#777",
    fontSize: "16px",
    flexDirection: "column",
    gap: "10px",
  },
};

export default function ChatPage() {
  const { friendId } = useParams();
  const { backendUrl, userData, userId } = useContext(AppContent);
  const navigate = useNavigate();

  const [friends, setFriends] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentFriend, setCurrentFriend] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);

  // -----------------------
  // Load friends
  // -----------------------
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/friends`, {
          withCredentials: true,
        });
        setFriends(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error loading friends:", err);
        setFriends([]);
      }
    };

    fetchFriends();
  }, [backendUrl]);

  // -----------------------
  // Setup socket
  // -----------------------
  useEffect(() => {
    if (!userId) return;

    socketRef.current = io(backendUrl, { withCredentials: true });
    socketRef.current.emit("userConnected", userId);

    socketRef.current.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [backendUrl, userId]);

  // -----------------------
  // Load messages when friend changes
  // -----------------------
  useEffect(() => {
    if (!friendId || !userId) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/messages/${friendId}`, {
          withCredentials: true,
        });
        setMessages(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error loading messages:", err);
        setMessages([]);
      }
    };

    const selectedFriend = friends.find((f) => f._id === friendId);
    setCurrentFriend(selectedFriend || null);

    fetchMessages();

    if (socketRef.current) {
      const roomId = [userId, friendId].sort().join("_");
      socketRef.current.emit("joinRoom", roomId);
    }
  }, [friendId, friends, userId, backendUrl]);

  // -----------------------
  // Auto-scroll messages
  // -----------------------
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // -----------------------
  // Send message
  // -----------------------
  const sendMessage = async () => {
    if (!newMessage.trim() || !friendId || !userId) return;

    const roomId = [userId, friendId].sort().join("_");
    const msgData = { roomId, message: newMessage, sender: userId };

    socketRef.current?.emit("chatMessage", msgData);

    try {
      await axios.post(
        `${backendUrl}/api/messages/send`,
        { receiver: friendId, message: newMessage },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Error saving message:", err);
    }

    setMessages((prev) => [...prev, { ...msgData, createdAt: new Date() }]);
    setNewMessage("");
  };

  // -----------------------
  // Handle unauthenticated users
  // -----------------------
  if (!userData) {
    return (
      <div style={styles.emptyState}>
        ⚠️ You must be logged in to use chat.
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

  // -----------------------
  // Render
  // -----------------------
  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarHeader}>💬 Chats</h2>
        {friends.map((f) => (
          <div
            key={f._id}
            style={{
              ...styles.friendItem,
              backgroundColor: f._id === friendId ? "#e3f2fd" : "transparent",
            }}
            onClick={() => navigate(`/chat/${f._id}`)}
          >
            <img
              src={
                f.avatar ||
                "https://res.cloudinary.com/dlixtmy1x/image/upload/v1755115315/avatar_izmj6c.webp"
              }
              alt={f.name}
              style={styles.avatar}
            />
            <span>{f.name}</span>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div style={styles.chatWindow}>
        {currentFriend ? (
          <>
            <div style={styles.chatHeader}>
              <img
                src={
                  currentFriend.avatar ||
                  "https://res.cloudinary.com/dlixtmy1x/image/upload/v1755115315/avatar_izmj6c.webp"
                }
                alt={currentFriend.name}
                style={styles.avatar}
              />
              <h3>{currentFriend.name}</h3>
            </div>

            <div style={styles.messages}>
              {messages.length > 0 ? (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.message,
                      alignSelf: msg.sender === userId ? "flex-end" : "flex-start",
                      backgroundColor: msg.sender === userId ? "#DCF8C6" : "#fff",
                    }}
                  >
                    {msg.message}
                    <div style={styles.timestamp}>
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.emptyState}>No messages yet</div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div style={styles.inputBox}>
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={styles.input}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button onClick={sendMessage} style={styles.sendButton}>
                ➤
              </button>
            </div>
          </>
        ) : (
          <div style={styles.emptyState}>👈 Select a friend to chat</div>
        )}
      </div>
    </div>
  );
}
