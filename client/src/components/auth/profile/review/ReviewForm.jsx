import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { AppContent } from '../../../../context/AppContext';
import apis from '../../../../assets/utils/apis';
import httpAction from '../../../../assets/utils/httpAction';
import { useNavigate } from 'react-router-dom';

const ReviewForm = ({ onReviewCreated }) => {
  const { userData, handleLogin } = useContext(AppContent);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [user, setUser] = useState(userData);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const result = await httpAction({ url: apis().userProfile, method: 'GET' });
      if (result?.success && result.user) {
        handleLogin?.(result.user);
        setUser(result.user);
      } else setUser(null);
    };
    fetchUser();
  }, []);

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ marginBottom: 16, textAlign: 'center' }}
      >
        <span style={{ color: '#555' }}>Please </span>
        <span
          onClick={() => navigate('/login')}
          style={{ cursor: 'pointer', color: 'red', fontWeight: 'bold' }}
        >
          Login
        </span>
        <span style={{ color: '#555' }}> to write a review.</span>
      </motion.div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { url: apis().createReview, method: 'POST', body: { content, rating } };
    const result = await httpAction(data);
    if (result.success) {
      toast.success('Review submitted');
      setContent('');
      setRating(5);
      onReviewCreated?.();
    } else {
      toast.error(result.message || 'Failed to submit review');
    }
  };

  const inputStyle = { width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', marginBottom: 12, fontSize: 14 };
  const buttonStyle = { padding: '10px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', backgroundColor: '#4CAF50', color: '#fff', fontSize: 16 };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      style={{ marginBottom: 24 }}
    >
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 style={{ marginBottom: 12 }}>Write a Review</h3>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
        <textarea
          placeholder="Your review..."
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={inputStyle}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>Rating:</label>
        <input
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          style={{ width: 50, padding: 4, fontSize: 14, borderRadius: 4, border: '1px solid #ccc' }}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <button type="submit" style={buttonStyle}>Submit Review</button>
      </motion.div>
    </motion.form>
  );
};

export default ReviewForm;
