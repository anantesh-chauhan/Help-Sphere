import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import { AppContent } from '../../../../context/AppContext';

const socket = io('http://localhost:5050', { withCredentials: true });

const AllHelpRequests = () => {
  const { isAdmin, backendUrl } = useContext(AppContent);
  const [requests, setRequests] = useState([]);
  const [offersMap, setOffersMap] = useState({});
  const [chatMap, setChatMap] = useState({});

  useEffect(() => {
    // Load existing requests
    axios.get(`${backendUrl}/help/all`, { withCredentials: true })
      .then(res => setRequests(res.data))
      .catch(() => toast.error('Failed loading requests'));

    // Listen for new offers and chat messages
    socket.on('newOffer', offer => {
      setOffersMap(prev => ({
        ...prev,
        [offer.helpRequest]: [...(prev[offer.helpRequest]||[]), offer]
      }));
    });
    socket.on('message', payload => {
      setChatMap(prev => ({
        ...prev,
        [payload.roomId]: {
          ...(prev[payload.roomId] || {}),
          messages: [...(prev[payload.roomId]?.messages || []), payload]
        }
      }));
    });

    return () => {
      socket.off('newOffer');
      socket.off('message');
    };
  }, []);

  const sendOffer = async (reqId) => {
    const msg = chatMap[reqId]?.myOffer?.trim();
    if (!msg) return toast.error('Enter offer message');
    await axios.post(`${backendUrl}/help/offer`, { helpRequestId: reqId, message: msg }, { withCredentials: true });
    socket.emit('newOffer', { helpRequest: reqId, helper: { name: 'You' }, message: msg }); // optimistic update
    setChatMap(prev => ({
      ...prev,
      [reqId]: { ...prev[reqId], myOffer: '' }
    }));
  };

  const toggleChat = (reqId) => {
    socket.emit('joinRoom', reqId);
    setChatMap(prev => ({
      ...prev,
      [reqId]: { ...(prev[reqId] || {}), chatOpen: !prev[reqId]?.chatOpen }
    }));
  };

  const sendChat = (reqId) => {
    const { myMsg } = chatMap[reqId] || {};
    if (!myMsg) return;
    socket.emit('chatMessage', { roomId: reqId, message: myMsg, sender: 'You' });
    setChatMap(prev => ({
      ...prev,
      [reqId]: {
        ...prev[reqId],
        messages: [...(prev[reqId]?.messages || []), { roomId: reqId, message: myMsg, sender: 'You', createdAt: new Date() }],
        myMsg: ''
      }
    }));
  };

  return (
    <div style={{ padding: 20 }}>
      {requests.map(req => {
        const offers = offersMap[req._id] || [];
        const chat = chatMap[req._id] || {};

        return (
          <motion.div
            key={req._id}
            whileHover={{ scale: 1.02 }}
            style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, marginBottom: 20 }}
          >
            <h3>{req.title}</h3>
            <p>{req.description}</p>

            <textarea
              placeholder="Your offer message..."
              value={chat.myOffer || ''}
              onChange={e => setChatMap(prev => ({
                ...prev,
                [req._id]: { ...(prev[req._id] || {}), myOffer: e.target.value }
              }))}
              style={{ width: '100%', minHeight: 50 }}
            />
            <button onClick={() => sendOffer(req._id)}>Send Offer</button>

            <button onClick={() => toggleChat(req._id)}>
              {chat.chatOpen ? 'Close Chat' : 'Chat'}
            </button>

            {chat.chatOpen && (
              <div style={{ marginTop: 10 }}>
                <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                  {(chat.messages || []).map((msg, i) => (
                    <div key={i}>
                      <strong>{msg.sender}:</strong> {msg.message}
                    </div>
                  ))}
                </div>
                <input
                  value={chat.myMsg || ''}
                  onChange={e => setChatMap(prev => ({
                    ...prev,
                    [req._id]: { ...(prev[req._id] || {}), myMsg: e.target.value }
                  }))}
                  style={{ width: '80%', marginRight: 8 }}
                  placeholder="Type a message"
                />
                <button onClick={() => sendChat(req._id)}>Send</button>
              </div>
            )}

            {offers.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <h4>Offers</h4>
                {offers.map(o => (
                  <div key={o._id} style={{ borderTop: '1px solid #ddd', padding: 8 }}>
                    <strong>{o.helper?.name}</strong> ({o.helper?.email})<br />
                    {o.message}
                  </div>
                ))}
              </div>
            )}

            {isAdmin && (
              <button
                style={{ background: 'red', color: 'white', marginTop: 10 }}
                onClick={() => {
                  axios.delete(`${backendUrl}/help/${req._id}`, { withCredentials: true })
                    .then(() => setRequests(prev => prev.filter(r => r._id !== req._id)));
                }}
              >
                Delete
              </button>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default AllHelpRequests;
