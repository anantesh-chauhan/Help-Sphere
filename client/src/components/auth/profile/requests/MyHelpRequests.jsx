import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { AppContent } from '../../../../context/AppContext';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5050', { withCredentials: true });

const MyHelpRequests = () => {
  const { userData } = useContext(AppContent);
  const [requests, setRequests] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [activeChat, setActiveChat] = useState(null); // { requestId, offer }
  const [chatInput, setChatInput] = useState('');
  const [chats, setChats] = useState({}); // { offerId: [msgs] }

  useEffect(() => {
    fetchMyRequests();
    socket.on('message', ({ roomId, message, sender, createdAt }) => {
      setChats(prev => ({
        ...prev,
        [roomId]: [...(prev[roomId] || []), { message, sender, createdAt }]
      }));
    });
    return () => socket.off('message');
  }, []);

  const fetchMyRequests = async () => {
    try {
      const { data } = await axios.get('http://localhost:5050/help/my-requests', { withCredentials: true });
      setRequests(data.requests || []);
    } catch {
      toast.error('⚠️ Unable to fetch your requests.');
    }
  };

  const startChat = (reqId, offer) => {
    const roomId = offer._id;
    socket.emit('joinRoom', roomId);
    setActiveChat({ requestId: reqId, offer });
  };

  const sendMessage = () => {
    if (!chatInput.trim() || !activeChat) return;
    const { offer } = activeChat;
    socket.emit('chatMessage', { roomId: offer._id, sender: userData.name, message: chatInput });
    setChatInput('');
  };

  const containerStyle = { padding: 20, maxWidth: 800, margin: '0 auto' };
  const cardStyle = { background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: 16, padding: 20 };
  const buttonStyle = { padding: '6px 12px', border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 'bold', marginTop: 8 };
  const chatBoxStyle = { maxHeight: 200, overflowY: 'auto', padding: 8, marginBottom: 8, border: '1px solid #ddd', borderRadius: 5 };
  const chatInputStyle = { flex: 1, padding: 6, borderRadius: 5, border: '1px solid #ccc', marginRight: 8 };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>🗂️ My Help Requests</h2>

      {requests.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#555' }}>You haven’t created any help requests yet.</p>
      ) : (
        <motion.div layout>
          {requests.map(req => (
            <motion.div
              key={req._id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={cardStyle}
            >
              <h3 style={{ margin: 0, color: '#2E8B57' }}>📌 {req.title}</h3>
              <p style={{ color: '#555' }}>📝 {req.description}</p>
              <p style={{ fontSize: 12 }}>🗓 Needed by: {req.neededBy ? new Date(req.neededBy).toLocaleDateString() : 'N/A'}</p>

              <button
                style={buttonStyle}
                onClick={() => setExpanded(expanded === req._id ? null : req._id)}
              >
                {expanded === req._id ? 'Hide Offers' : `View Offers (${req.offers?.length || 0})`}
              </button>

              <AnimatePresence>
                {expanded === req._id && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #ddd' }}
                  >
                    {req.offers?.length ? req.offers.map(off => (
                      <div key={off._id} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                        <div style={{ background: '#2E8B57', color: '#fff', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {off.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                          <strong>{off.user.name}</strong> 📧 {off.user.email} {off.user.phone && <>📱 {off.user.phone}</>}
                          <p style={{ fontStyle: 'italic', margin: '4px 0' }}>💬 "{off.message}"</p>
                          <button style={{ ...buttonStyle, background: '#1E90FF', color: '#fff' }} onClick={() => startChat(req._id, off)}>💬 Chat</button>

                          {activeChat?.offer._id === off._id && (
                            <div style={{ marginTop: 8, padding: 10, border: '1px solid #ccc', borderRadius: 5 }}>
                              <p style={{ margin: 0, fontWeight: 'bold' }}>Chat with {off.user.name}</p>
                              <div style={chatBoxStyle}>
                                {(chats[off._id] || []).map((msg, i) => (
                                  <div key={i} style={{ marginBottom: 4, textAlign: msg.sender === userData.name ? 'right' : 'left' }}>
                                    <strong>{msg.sender}:</strong> {msg.message} <br />
                                    <span style={{ fontSize: 10, color: 'gray' }}>{new Date(msg.createdAt).toLocaleTimeString()}</span>
                                  </div>
                                ))}
                              </div>
                              <div style={{ display: 'flex' }}>
                                <input
                                  style={chatInputStyle}
                                  placeholder="✏️ Type a message..."
                                  value={chatInput}
                                  onChange={e => setChatInput(e.target.value)}
                                  onKeyPress={e => e.key === 'Enter' ? sendMessage() : null}
                                />
                                <button style={{ ...buttonStyle, background: '#4CAF50', color: '#fff' }} onClick={sendMessage}>🚀 Send</button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )) : (
                      <p>No offers yet.</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MyHelpRequests;
