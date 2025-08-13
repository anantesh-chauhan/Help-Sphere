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
    axios.get(`${backendUrl}/help/all`, { withCredentials: true })
      .then(res => setRequests(res.data))
      .catch(() => toast.error('⚠️ Failed loading requests'));

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
    if (!msg) return toast.error('✏️ Enter offer message');

    await axios.post(`${backendUrl}/help/offer`, { helpRequestId: reqId, message: msg }, { withCredentials: true });
    socket.emit('newOffer', { helpRequest: reqId, helper: { name: 'You' }, message: msg });

    setChatMap(prev => ({ ...prev, [reqId]: { ...prev[reqId], myOffer: '' } }));
  };

  const toggleChat = (reqId) => {
    socket.emit('joinRoom', reqId);
    setChatMap(prev => ({ ...prev, [reqId]: { ...(prev[reqId] || {}), chatOpen: !prev[reqId]?.chatOpen } }));
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

  const containerStyle = { padding: 20, maxWidth: 800, margin: '0 auto' };
  const cardStyle = { border: '1px solid #ccc', borderRadius: 10, padding: 16, marginBottom: 20, background: '#fff' };
  const textAreaStyle = { width: '100%', minHeight: 50, padding: 8, marginBottom: 8, borderRadius: 5, border: '1px solid #ccc' };
  const inputStyle = { flex: 1, padding: 8, marginRight: 8, borderRadius: 5, border: '1px solid #ccc' };
  const btnStyle = { padding: '6px 12px', border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 'bold' };
  const claimBtnStyle = { ...btnStyle, backgroundColor: '#4CAF50', color: '#fff' };
  const offerBtnStyle = { ...btnStyle, backgroundColor: '#FFD700', color: '#fff', marginRight: 8 };
  const chatBtnStyle = { ...btnStyle, backgroundColor: '#1E90FF', color: '#fff' };
  const deleteBtnStyle = { ...btnStyle, backgroundColor: '#FF0000', color: '#fff', marginTop: 10 };
  const chatBoxStyle = { maxHeight: 200, overflowY: 'auto', border: '1px solid #ddd', padding: 8, marginBottom: 8, borderRadius: 5 };

  return (
    <div style={containerStyle}>
      {requests.map(req => {
        const offers = offersMap[req._id] || [];
        const chat = chatMap[req._id] || {};

        return (
          <motion.div
            key={req._id}
            whileHover={{ scale: 1.02 }}
            style={cardStyle}
          >
            <h3 style={{ fontSize: 18, fontWeight: 'bold', color: '#2E8B57' }}>📌 {req.title}</h3>
            <p style={{ color: '#555', marginBottom: 8 }}>📝 {req.description}</p>

            <textarea
              placeholder="💬 Your offer message..."
              value={chat.myOffer || ''}
              onChange={e => setChatMap(prev => ({ ...prev, [req._id]: { ...(prev[req._id] || {}), myOffer: e.target.value } }))}
              style={textAreaStyle}
            />
            <div style={{ display: 'flex', marginBottom: 8 }}>
              <button style={offerBtnStyle} onClick={() => sendOffer(req._id)}>✉️ Send Offer</button>
              <button style={chatBtnStyle} onClick={() => toggleChat(req._id)}>{chat.chatOpen ? '🔒 Close Chat' : '💬 Chat'}</button>
            </div>

            {chat.chatOpen && (
              <div>
                <div style={chatBoxStyle}>
                  {(chat.messages || []).map((msg, i) => (
                    <div key={i} style={{ marginBottom: 4 }}><strong>{msg.sender}:</strong> {msg.message}</div>
                  ))}
                </div>
                <div style={{ display: 'flex' }}>
                  <input
                    value={chat.myMsg || ''}
                    onChange={e => setChatMap(prev => ({ ...prev, [req._id]: { ...(prev[req._id] || {}), myMsg: e.target.value } }))}
                    placeholder="✏️ Type a message"
                    style={inputStyle}
                  />
                  <button style={claimBtnStyle} onClick={() => sendChat(req._id)}>🚀 Send</button>
                </div>
              </div>
            )}

            {offers.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <h4>🎁 Offers</h4>
                {offers.map(o => (
                  <div key={o._id} style={{ borderTop: '1px solid #ddd', paddingTop: 4, marginTop: 4 }}>
                    <strong>👤 {o.helper?.name}</strong> ({o.helper?.email})<br />
                    💬 {o.message}
                  </div>
                ))}
              </div>
            )}

            {isAdmin && (
              <button
                style={deleteBtnStyle}
                onClick={() => {
                  axios.delete(`${backendUrl}/help/${req._id}`, { withCredentials: true })
                    .then(() => setRequests(prev => prev.filter(r => r._id !== req._id)));
                }}
              >
                🗑️ Delete
              </button>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default AllHelpRequests;
