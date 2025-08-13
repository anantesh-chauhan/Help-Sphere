import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchUsers from './SearchUsers';
import IncomingRequests from './IncomingRequests';
import AllUsersPage from './AllUsers';
import OutgoingRequests from './OutgoingRequests';
import FriendsList from './FriendsList';

export default function FriendsHub() {
  const [tab, setTab] = useState('search');

  const tabs = [
    { id: 'search', label: '🔍 Search' },
    { id: 'all-users', label: '🌍 All Users' },
    { id: 'incoming', label: '📥 Incoming' },
    { id: 'outgoing', label: '📤 Outgoing' },
    { id: 'friends', label: '👥 Friends' },
  ];

  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Tab Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '2px solid #ddd',
          marginBottom: '20px',
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderBottom:
                tab === t.id ? '3px solid #3b82f6' : '3px solid transparent',
              background: 'none',
              color: tab === t.id ? '#3b82f6' : '#555',
              fontWeight: tab === t.id ? 'bold' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content with smooth transitions */}
      <AnimatePresence exitBeforeEnter>
        {tab === 'search' && (
          <motion.div
            key="search"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <SearchUsers />
          </motion.div>
        )}
        {tab === 'all-users' && (
          <motion.div
            key="all-users"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <AllUsersPage />
          </motion.div>
        )}
        {tab === 'incoming' && (
          <motion.div
            key="incoming"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <IncomingRequests />
          </motion.div>
        )}
        {tab === 'outgoing' && (
          <motion.div
            key="outgoing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <OutgoingRequests />
          </motion.div>
        )}
        {tab === 'friends' && (
          <motion.div
            key="friends"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <FriendsList />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
