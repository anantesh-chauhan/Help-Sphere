import React from 'react';
import { motion } from 'framer-motion';

const tabs = [
  { id: 'personal', label: 'Personal Details', defaultEmoji: '📝' },
  { id: 'reviews', label: 'Reviews', defaultEmoji: '⭐' },
  { id: 'donations', label: 'Donations', defaultEmoji: '💝' },
  { id: 'requests', label: 'Help Requests', defaultEmoji: '📢' },
  { id: 'claims', label: 'Claims', defaultEmoji: '📄' },
  { id: 'password', label: 'Update Password', defaultEmoji: '🔒' },
  { id: 'achievements', label: 'Achievements', defaultEmoji: '🏆' },
  { id: 'bug-reports', label: 'Bug Reports', defaultEmoji: '🐞' },
  { id: 'friends', label: 'Friends', defaultEmoji: '👥' },
  { id: 'logout', label: 'Logout', defaultEmoji: '🚪' },
];

const ProfileNav = ({ activeTab, setActiveTab, tabEmojis = {} }) => {
  return (
    <motion.div
      className="tab-nav"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        borderBottom: '1px solid #ccc',
        paddingBottom: '8px',
        marginBottom: '20px',
        justifyContent: 'center',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const emoji = tabEmojis[tab.id] || tab.defaultEmoji || '';
        return (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '10px 16px',
              background: 'none',
              border: 'none',
              borderBottom: isActive ? '3px solid #4CAF50' : '3px solid transparent',
              color: isActive ? '#4CAF50' : '#333',
              fontWeight: isActive ? '600' : '400',
              fontSize: '0.95rem',
              cursor: 'pointer',
              position: 'relative',
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{emoji}</span> {tab.label}
            {isActive && (
              <motion.div
                layoutId="underline"
                style={{
                  height: '3px',
                  background: '#4CAF50',
                  position: 'absolute',
                  bottom: '-3px',
                  left: 0,
                  right: 0,
                  borderRadius: '4px',
                }}
              />
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default ProfileNav;
