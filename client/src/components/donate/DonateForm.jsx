import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const DonateForm = () => {
  const [donation, setDonation] = useState({
    donorName: '',
    contact: '',
    category: '',
    itemType: '',
    quantity: '',
    condition: '',
    city: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);

  const categories = [
    'Essentials',
    'Education',
    'Electronics',
    'Furniture',
    'Toys & Games',
    'Kitchenware',
    'Miscellaneous'
  ];

  const handleChange = (e) => {
    setDonation({ ...donation, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5050/donation/donate', donation);
      toast.success("Donation submitted successfully!");
      setDonation({
        donorName: '',
        contact: '',
        category: '',
        itemType: '',
        quantity: '',
        condition: '',
        city: '',
        description: ''
      });
    } catch (err) {
      toast.error("Failed to submit donation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        maxWidth: '520px',
        margin: '50px auto',
        padding: '28px',
        borderRadius: '10px',
        backgroundColor: '#f0fff0',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
    >
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          textAlign: 'center',
          color: '#0b572d',
          fontSize: '24px',
          fontWeight: '600',
          marginBottom: '20px'
        }}
      >
        Donate an Item
      </motion.h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {[
          ['donorName', 'Your Name'],
          ['contact', 'Contact Number'],
          ['itemType', 'Item Type (Books, Clothes...)'],
          ['quantity', 'Quantity'],
          ['condition', 'Condition (New, Used...)'],
          ['city', 'City']
        ].map(([name, placeholder]) => (
          <motion.input
            key={name}
            name={name}
            placeholder={placeholder}
            value={donation[name]}
            onChange={handleChange}
            required
            whileFocus={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300 }}
            style={{
              padding: '10px',
              fontSize: '15px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              outline: 'none'
            }}
          />
        ))}

        <motion.select
          name="category"
          value={donation.category}
          onChange={handleChange}
          required
          whileFocus={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 300 }}
          style={{
            padding: '10px',
            fontSize: '15px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            outline: 'none'
          }}
        >
          <option value="" disabled>Select Category</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </motion.select>

        <motion.textarea
          name="description"
          placeholder="Description (optional)"
          value={donation.description}
          onChange={handleChange}
          whileFocus={{ scale: 1.02 }}
          style={{
            padding: '10px',
            fontSize: '15px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            resize: 'none',
            height: '100px',
            outline: 'none'
          }}
        />

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          style={{
            padding: '12px',
            backgroundColor: loading ? '#888' : '#0b572d',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Submitting...' : 'Submit Donation'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default DonateForm;
