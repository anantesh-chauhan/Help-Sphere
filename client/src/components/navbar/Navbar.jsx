import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { AppContent } from '../../context/AppContext';
import LogoutButton from '../auth/profile/Logout';

const Navbar = () => {
  const { userData } = useContext(AppContent);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const dp = userData?.name?.charAt(0).toUpperCase() || 'U';

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: "NGO's", to: '/view-ngos' },
    { label: 'Donate', to: '/view-donations' },
    { label: 'Help-Request', to: '/help-requests' },
    { label: 'Reviews', to: '/reviews' },
    { label: 'Report Bug', to: '/report-bug', auth: true },
    { label: 'Login', to: '/login', guest: true },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles = {
    header: {
      backgroundColor: '#A294F9',
      color: 'white',
      padding: '0.75rem 1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    },
    brandContainer: {
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
    },
    brandCircle: {
      backgroundColor: '#5bdd51',
      color: 'white',
      height: '40px',
      width: '40px',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 'bolder',
      marginRight: '0.5rem',
    },
    brandText: {
      color: '#facc15',
      fontWeight: 'bold',
      fontSize: '1.2rem',
    },
    navLink: {
      textDecoration: 'none',
      color: 'white',
      padding: '0.5rem 1rem',
      fontWeight: 'bold',
    },
    desktopNav: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap',
      justifyContent: 'center',
      flexGrow: 1,
    },
    avatar: {
      backgroundColor: 'green',
      color: 'white',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      marginLeft: '0.5rem',
    },
    hamburger: {
      fontSize: '1.5rem',
      background: 'none',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
    },
    sidebar: {
      position: 'fixed',
      top: 0,
      right: 0,
      height: '100vh',
      width: '250px',
      backgroundColor: '#fff',
      color: '#000',
      padding: '1rem',
      boxShadow: '-2px 0 5px rgba(0,0,0,0.2)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1001,
    },
    sidebarLink: {
      textDecoration: 'none',
      color: '#000',
      padding: '0.5rem 0',
      fontWeight: 'bold',
    },
  };

  return (
    <header style={styles.header}>
      {/* Brand */}
      <Link to="/" style={styles.brandContainer}>
        <div style={styles.brandCircle}>HS</div>
        <span style={styles.brandText}>Help-Sphere</span>
      </Link>

      {/* Desktop Nav */}
      {!isMobile && (
        <nav style={styles.desktopNav}>
          {navLinks.map((link, idx) => {
            if (link.auth && !userData) return null;
            if (link.guest && userData) return null;
            return (
              <Link key={idx} to={link.to} style={styles.navLink}>
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}

      {/* User Section */}
      {!isMobile && userData && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={styles.avatar}>{dp}</div>
          <LogoutButton />
        </div>
      )}

      {/* Hamburger (Mobile only) */}
      {isMobile && (
        <button onClick={() => setSidebarOpen(true)} style={styles.hamburger}>
          <FaBars />
        </button>
      )}

      {/* Sidebar */}
      {sidebarOpen && isMobile && (
        <div style={styles.sidebar}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 'bold' }}>Menu</h3>
            <button onClick={() => setSidebarOpen(false)} style={{ fontSize: '1.5rem', border: 'none', background: 'none' }}>
              <FaTimes />
            </button>
          </div>

          {navLinks.map((link, idx) => {
            if (link.auth && !userData) return null;
            if (link.guest && userData) return null;
            return (
              <Link key={idx} to={link.to} onClick={() => setSidebarOpen(false)} style={styles.sidebarLink}>
                {link.label}
              </Link>
            );
          })}

          {/* Sidebar User Info */}
          {userData && (
            <div style={{ marginTop: 'auto', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={styles.avatar}>{dp}</div>
                <div style={{ fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: 'bold' }}>{userData.name}</div>
                  <div style={{ color: '#8c4de9' }}>{userData.email}</div>
                  <LogoutButton />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
