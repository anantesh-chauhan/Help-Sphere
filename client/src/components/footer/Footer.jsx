import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { when: 'beforeChildren', staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const iconHover = {
  whileHover: { scale: 1.5, rotate: 5 },
  whileTap: { scale: 0.95 },
};

const Footer = () => {
  return (
    <motion.footer
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        background: '#898AC4',
        color: 'white',
        padding: '60px 24px 30px',
        width: '100%',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '40px',
        }}
      >
        {/* About */}
        <motion.div variants={itemVariants} style={{ flex: '1 1 280px', minWidth: '260px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#facc15', marginBottom: '16px' }}>
            🌿 HelpSphere
          </h2>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#d1d5db' }}>
            A community-driven platform to request and offer help. Empowering people through unity, kindness, and compassion.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={itemVariants} style={{ flex: '1 1 200px', minWidth: '200px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#facc15', marginBottom: '16px' }}>
            🔗 Quick Links
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', color: '#d1d5db' }}>
            {[
              { name: 'Home', path: '/' },
              { name: 'Help Requests', path: '/help-requests' },
              // { name: 'Add NGO', path: '/add-ngo' },
              // { name: 'View NGOs', path: '/view-ngos' },
              // { name: 'Image Upload', path: '/image-upload' },
              // { name: 'Create Request', path: '/create-request' },
              // { name: 'Donate', path: '/donate' },
              { name: 'View Donations', path: '/view-donations' },
              { name: 'Contact', path: '/contact' },
              { name: 'Login', path: '/login' },
              { name: 'All Reviews', path: '/reviews' },
            ].map((link) => (
              <motion.li
                key={link.path}
                whileHover={{ scale: 1.05, x: 4 }}
                transition={{ duration: 0.2 }}
                style={{ marginBottom: '8px' }}
              >
                <Link
                  to={link.path}
                  style={{
                    color: '#d1d5db',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.target.style.color = '#fde68a')}
                  onMouseLeave={(e) => (e.target.style.color = '#d1d5db')}
                >
                  {link.name}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Contact and Social */}
        <motion.div variants={itemVariants} style={{ flex: '1 1 220px', minWidth: '200px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#facc15', marginBottom: '16px' }}>
            📞 Contact
          </h2>
          <p style={{ fontSize: '14px', marginBottom: '4px', color: '#d1d5db' }}>
            Email: support@helpsphere.org
          </p>
          <p style={{ fontSize: '14px', marginBottom: '16px', color: '#d1d5db' }}>
            Phone: +91 98765 43210
          </p>
          <div style={{ display: 'flex', gap: '14px', marginTop: '8px' }}>
            {[
              { icon: FaFacebookF, link: 'https://facebook.com' },
              { icon: FaTwitter, link: 'https://twitter.com' },
              { icon: FaInstagram, link: 'https://instagram.com' },
              { icon: FaLinkedinIn, link: 'https://linkedin.com' },
            ].map(({ icon: Icon, link }, index) => (
              <motion.a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                {...iconHover}
                style={{ color: '#ffffff', fontSize: '20px' }}
              >
                <Icon />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer Bottom */}
      <motion.div
        variants={itemVariants}
        style={{
          textAlign: 'center',
          fontSize: '13px',
          color: 'orange',
          marginTop: '40px',
          paddingTop: '16px',
          borderTop: '1px solid rgb(227, 111, 10)',
        }}
      >
        &copy; {new Date().getFullYear()}{' '}
        <span style={{ color: '#facc15', fontWeight: '600' }}>HelpSphere</span>. All rights reserved.
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
