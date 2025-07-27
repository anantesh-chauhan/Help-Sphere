import React, { useEffect, useState } from 'react';
import { Box, Typography, Rating, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import moment from 'moment';
import apis from '../../assets/utils/apis';
import httpAction from '../../assets/utils/httpAction';

const AllReviews = () => {
  const [reviews, setReviews] = useState([]);

  const fetchAllReviews = async () => {
    const data = { url: apis().getAllReviews, method: 'GET' };
    const result = await httpAction(data);
    if (result.success) setReviews(result.reviews || []);
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  if (reviews.length === 0) {
    return <Typography>Loading reviews...</Typography>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        What People Are Saying
      </Typography>

      {reviews.map((review) =>
        review && review._id ? (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              marginBottom: '16px',
              padding: '16px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              background: '#fafafa',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar>{review.user?.name?.charAt(0) || 'U'}</Avatar>
              <Box>
                <Typography sx={{ fontWeight: 600 }}>
                  {review.user?.name || 'Anonymous'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'gray' }}>
                  {moment(review.createdAt).fromNow()}
                </Typography>
              </Box>
            </Box>

            <Typography sx={{ mt: 1 }}>{review.content}</Typography>

            <Rating value={review.rating || 0} readOnly size="small" sx={{ mt: 1 }} />
          </motion.div>
        ) : null
      )}
    </Box>
  );
};

export default AllReviews;
