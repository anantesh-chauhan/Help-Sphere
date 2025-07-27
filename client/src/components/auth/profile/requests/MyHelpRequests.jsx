import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Box, Typography, Avatar, Button, TextField, useMediaQuery, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { AppContent } from '../../../../context/AppContext';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5050', { withCredentials: true });

const MyHelpRequests = () => {
  const { userData } = useContext(AppContent);
  const isMobile = useMediaQuery('(max-width:600px)');
  const [requests, setRequests] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [activeChat, setActiveChat] = useState(null); // { requestId, offerId }
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
    } catch (err) {
      toast.error('Unable to fetch your requests.');
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
    socket.emit('chatMessage', {
      roomId: offer._id,
      sender: userData.name,
      message: chatInput
    });
    setChatInput('');
  };

  return (
    <Box sx={{ p: isMobile ? 2 : 4 }}>
      <Typography variant="h5" align="center" gutterBottom>🗂️ My Help Requests</Typography>

      {requests.length === 0 ? (
        <Typography align="center">You haven’t created any help requests yet.</Typography>
      ) : (
        <motion.div layout>
          {requests.map(req => (
            <motion.div key={req._id} layout initial={{ opacity: 0,y:10 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-10 }}
              style={{ background:'#fff',borderRadius:8,boxShadow:'0 2px 8px rgba(0,0,0,0.1)',marginBottom:16,padding:20 }}
            >
              <Typography variant="h6">{req.title}</Typography>
              <Typography color="textSecondary">{req.description}</Typography>
              <Typography variant="body2">🗓 Needed by: {req.neededBy ? new Date(req.neededBy).toLocaleDateString() : 'N/A'}</Typography>

              <Button size="small" onClick={() => setExpanded(expanded === req._id ? null : req._id)} sx={{ mt: 1 }}>
                {expanded === req._id ? 'Hide Offers' : `View Offers (${req.offers?.length || 0})`}
              </Button>

              <AnimatePresence>
                {expanded === req._id && (
                  <motion.div layout initial={{ opacity:0,height:0 }}
                    animate={{ opacity:1,height:'auto' }} exit={{ opacity:0,height:0 }} transition={{ duration:0.3 }}
                    style={{ marginTop:16,paddingTop:16,borderTop:'1px solid #ddd' }}
                  >
                    {req.offers?.length ? req.offers.map(off => (
                      <Box key={off._id} sx={{ display:'flex',gap:2,mb:2 }}>
                        <Avatar>{off.user.name.charAt(0)}</Avatar>
                        <Box>
                          <Typography fontWeight={600}>{off.user.name}</Typography>
                          <Typography variant="body2">📧 {off.user.email}</Typography>
                          {off.user.phone && <Typography variant="body2">📱 {off.user.phone}</Typography>}
                          <Typography variant="body2" sx={{ mt:1, fontStyle:'italic' }}>"{off.message}"</Typography>
                          <Button size="small" onClick={() => startChat(req._id, off)} sx={{ mt:1 }}>Chat</Button>

                          {activeChat?.offer._id === off._id && (
                            <Paper variant="outlined" sx={{ mt:2, p:2 }}>
                              <Typography variant="subtitle2">Chat with {off.user.name}</Typography>
                              <Box sx={{ maxHeight:200, overflowY:'auto', mb:1 }}>
                                {(chats[off._id] || []).map((msg,i) => (
                                  <Box key={i} sx={{ mb:0.5, textAlign: msg.sender === userData.name ? 'right' : 'left' }}>
                                    <Typography variant="body2"><strong>{msg.sender}:</strong> {msg.message}</Typography>
                                    <Typography variant="caption" color="gray">{new Date(msg.createdAt).toLocaleTimeString()}</Typography>
                                  </Box>
                                ))}
                              </Box>
                              <Box sx={{ display:'flex', gap:1 }}>
                                <TextField
                                  fullWidth size="small" variant="outlined" placeholder="Type a message..."
                                  value={chatInput} onChange={e => setChatInput(e.target.value)}
                                  onKeyPress={e => e.key === 'Enter' ? sendMessage() : null}
                                />
                                <Button variant="contained" onClick={sendMessage}>Send</Button>
                              </Box>
                            </Paper>
                          )}
                        </Box>
                      </Box>
                    )) : (
                      <Typography>No offers yet.</Typography>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      )}
    </Box>
  );
};

export default MyHelpRequests;
