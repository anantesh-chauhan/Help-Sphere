import React, { useContext, useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Rating,
  Typography,
} from '@mui/material';
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
      const result = await httpAction({
        url: apis().userProfile,
        method: 'GET',
      });

      if (result?.success && result.user) {
        handleLogin?.(result.user); // update global context
        setUser(result.user);       // update local state
      } else {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Typography variant="body1" color="error">
          Please <span onClick={() => navigate('/login')} style={{ cursor: 'pointer', color: 'red' }}>Login</span> to write a review.
        </Typography>
      </motion.div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      url: apis().createReview,
      method: 'POST',
      body: { content, rating },
    };

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

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      style={{ marginBottom: '1.5rem' }}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Write a Review
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <TextField
          label="Your Review"
          multiline
          rows={3}
          fullWidth
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mb: 2 }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Rating
          value={rating}
          onChange={(e, val) => setRating(val)}
          sx={{ mb: 2 }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button type="submit" variant="contained" fullWidth>
          Submit Review
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default ReviewForm;
