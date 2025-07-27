import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const ViewDonations = () => {
  const [donations, setDonations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  const categories = [
    'All',
    'Essentials',
    'Education',
    'Electronics',
    'Furniture',
    'Toys & Games',
    'Kitchenware',
    'Miscellaneous'
  ];

  useEffect(() => {
    axios.get('http://localhost:5050/donation/view')
      .then(res => {
        setDonations(res.data);
        setFiltered(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleFilter = (cat) => {
    setCategory(cat);
    if (cat === 'All' || cat === '') {
      setFiltered(donations);
    } else {
      const result = donations.filter(item => item.category === cat);
      setFiltered(result);
    }
  };

  if (loading) {
    return (
      <motion.div
        style={{ textAlign: 'center', padding: '50px', fontSize: '18px', color: '#0b572d' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Loading Donations...
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        maxWidth: '1000px',
        margin: '40px auto',
        padding: '20px'
        
      }}
    >
      <motion.h2
        style={{
          textAlign: 'center',
          color: '#0b572d',
          fontSize: '24px',
          marginBottom: '20px'
        }}
      >
        All Donations
      </motion.h2>

      <motion.div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '30px'
        }}
      >
        {categories.map((cat, idx) => (
          <motion.button
            key={idx}
            onClick={() => handleFilter(cat)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '8px 16px',
              backgroundColor: category === cat ? '#0b572d' : '#e0f3e2',
              color: category === cat ? '#fff' : '#0b572d',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '14px'
            }}
          >
            {cat}
          </motion.button>
        ))}
      </motion.div>

      {filtered.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No donations found.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}
        >
          {filtered.map((item) => (
            <motion.div
              key={item._id}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              style={{
                padding: '16px',
                borderRadius: '10px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #ddd'
              }}
            >
              <h3 style={{ color: '#0b572d', fontSize: '18px' }}>{item.itemType}</h3>
              <p><strong>Category:</strong> {item.category || 'Not specified'}</p>
              <p><strong>Donor:</strong> {item.donorName}</p>
              <p><strong>Contact:</strong> {item.contact}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
              <p><strong>Condition:</strong> {item.condition}</p>
              <p><strong>City:</strong> {item.city}</p>
              {item.description && <p><strong>Note:</strong> {item.description}</p>}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ViewDonations;
