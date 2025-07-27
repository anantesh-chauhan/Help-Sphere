import React, { useState } from 'react';
import BasicInfo from './BasicInfo';
import ProfileNav from './ProfileNav';
import PersonalDetails from './PersonalDetails';
import Reviews from './Reviews';
import Claims from './Claims';
import UpdatePassword from './UpdatePassword';
import Achievements from './Achievements';
import LogoutButton from './Logout';
import ReportBug from './ReportBug';
import { motion } from 'framer-motion';
import HelpRequest from './HelpRequest';
import Donations from './donatinons/Donations';


const Profile = () => {
  const [activeTab, setActiveTab] = useState('personal');

  const renderTabComponent = () => {
    switch (activeTab) {
      case 'personal': return <PersonalDetails />;
      case 'reviews': return <Reviews />;
      case 'donations': return <Donations />;
      case 'requests': return  <HelpRequest />;
      case 'claims': return <Claims />;
      case 'password': return <UpdatePassword />;
      case 'achievements': return <Achievements />;
      case 'logout': return <LogoutButton />;
      case 'bug-reports': return <ReportBug />;
      default: return null;
    }
  };

  return (
    <motion.div
      className="profile-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      style={{
        padding: '20px',
        maxWidth: '1000px',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <BasicInfo />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <ProfileNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </motion.div>

      <motion.div
        style={{ marginTop: '20px' }}
        key={activeTab}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.3 }}
      >
        {renderTabComponent()}
      </motion.div>
    </motion.div>
  );
};

export default Profile;
