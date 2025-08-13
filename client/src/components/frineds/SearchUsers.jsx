import { useState, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AppContent } from '../../context/AppContext';

export default function SearchUsers() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { backendUrl } = useContext(AppContent);
  const defaultAvatar = 'https://res.cloudinary.com/dlixtmy1x/image/upload/v1755115315/avatar_izmj6c.webp';

  const search = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/friends/search?q=${query}`, { withCredentials: true });
      setResults(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error searching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (id) => {
    try {
      await axios.post(`${backendUrl}/api/friends/request`, { toUserId: id }, { withCredentials: true });
      search();
    } catch (err) {
      console.error('Error sending friend request:', err);
    }
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
    fontFamily: 'Arial, sans-serif'
  };

  const inputStyle = {
    border: '1px solid #ccc',
    padding: '10px',
    flex: 1,
    borderRadius: '8px 0 0 8px',
    fontSize: '16px'
  };

  const buttonStyle = {
    backgroundColor: '#2563eb',
    color: '#fff',
    padding: '10px 16px',
    border: 'none',
    borderRadius: '0 8px 8px 0',
    cursor: 'pointer',
    fontSize: '16px'
  };

  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    padding: '16px',
    textAlign: 'center'
  };

  const avatarStyle = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    marginBottom: '8px'
  };

  const statusButtonStyle = {
    base: {
      padding: '6px 12px',
      borderRadius: '6px',
      color: '#fff',
      border: 'none',
      fontSize: '14px',
      cursor: 'pointer'
    },
    green: { backgroundColor: '#22c55e' },
    yellow: { backgroundColor: '#facc15' },
    blue: { backgroundColor: '#3b82f6' }
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Search Users</h1>

      {/* Search Bar */}
      <div style={{ display: 'flex', marginBottom: '24px' }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={inputStyle}
          placeholder="Search users..."
        />
        <button onClick={search} style={buttonStyle}>Search</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '24px' }}>Searching users...</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {results.map(user => (
            <motion.div
              key={user._id}
              style={cardStyle}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <motion.img
                src={user.avatar || defaultAvatar}
                alt={user.name || 'User'}
                style={avatarStyle}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4 }}
              />
              <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>{user.name}</h2>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>{user.email}</p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '8px', fontSize: '14px', color: '#4b5563' }}>
                <span>Donations: {user.donations ?? 0}</span>
                <span>Helps: {user.helpRequests ?? 0}</span>
              </div>

              <div style={{ marginTop: '12px' }}>
                {user.friendStatus === 'not_friend' && (
                  <button
                    onClick={() => sendRequest(user._id)}
                    style={{ ...statusButtonStyle.base, ...statusButtonStyle.green }}
                  >
                    Add Friend
                  </button>
                )}
                {user.friendStatus === 'pending' && (
                  <span style={{ ...statusButtonStyle.base, ...statusButtonStyle.yellow }}>Pending</span>
                )}
                {user.friendStatus === 'friend' && (
                  <span style={{ ...statusButtonStyle.base, ...statusButtonStyle.blue }}>Friends</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
