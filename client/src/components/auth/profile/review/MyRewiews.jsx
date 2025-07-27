import React, { useEffect, useState } from 'react';
import {
  Button,
  Rating,
  Box,
  Typography,
  TextField,
  Avatar,
  useMediaQuery,
} from '@mui/material';
import { toast } from 'react-toastify';
import moment from 'moment';
import apis from '../../../../assets/utils/apis';
import httpAction from '../../../../assets/utils/httpAction';
import { motion, AnimatePresence } from 'framer-motion';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [editedRating, setEditedRating] = useState(5);
  const isMobile = useMediaQuery('(max-width:600px)');

  const fetchReviews = async () => {
    const data = { url: apis().getMyReviews, method: 'GET' };
    const result = await httpAction(data);
    if (result.success && Array.isArray(result.reviews)) {
      setReviews(result.reviews.filter(Boolean));
    } else {
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    const result = await httpAction({
      url: apis().deleteReview(id),
      method: 'DELETE',
    });
    if (result?.success) {
      toast.success('Review deleted');
      fetchReviews();
    } else {
      toast.error(result?.message || 'Delete failed');
    }
  };

  const handleEdit = async (id) => {
    const data = {
      url: apis().updateReview(id),
      method: 'PUT',
      body: { content: editedContent, rating: editedRating },
    };
    const result = await httpAction(data);
    if (result?.success) {
      toast.success('Review updated');
      setEditingId(null);
      fetchReviews();
    } else {
      toast.error(result?.message || 'Update failed');
    }
  };

  return (
    <Box sx={{ padding: isMobile ? '1rem' : '2rem' }}>
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          fontSize: isMobile ? '1.4rem' : '2rem',
          marginBottom: '1rem',
          fontWeight: 600,
          textAlign: 'center',
        }}
      >
        My Reviews
      </motion.h2>

      <AnimatePresence>
        {reviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: 'center' }}
          >
            <Typography variant="body1" color="text.secondary">
              You haven't written any reviews yet.
            </Typography>
          </motion.div>
        ) : (
          reviews.map((rev) =>
            rev && rev._id ? (
              <motion.div
                key={rev._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  borderRadius: '12px',
                  background: '#f9f9f9',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                }}
              >
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar>{rev.user?.name?.charAt(0) || 'U'}</Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>
                      {rev.user?.name || 'You'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'gray' }}>
                      {moment(rev.createdAt).fromNow()}
                    </Typography>
                  </Box>
                </Box>

                {/* Editable or Static Content */}
                <Box sx={{ mt: 1 }}>
                  {editingId === rev._id ? (
                    <>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        value={editedContent || ''}
                        onChange={(e) => setEditedContent(e.target.value)}
                        sx={{ mb: 1 }}
                      />
                      <Rating
                        value={editedRating || 0}
                        onChange={(e, val) => setEditedRating(val)}
                        sx={{ mb: 1 }}
                      />
                      <Box display="flex" gap={1} flexWrap="wrap">
                        <Button variant="contained" onClick={() => handleEdit(rev._id)}>
                          Save
                        </Button>
                        <Button variant="outlined" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Typography sx={{ mt: 1, wordBreak: 'break-word' }}>
                        {rev.content || 'No content provided.'}
                      </Typography>
                      <Rating
                        value={rev.rating || 0}
                        readOnly
                        size="small"
                        sx={{ mt: 1 }}
                      />
                      <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setEditingId(rev._id);
                            setEditedContent(rev.content || '');
                            setEditedRating(rev.rating || 0);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(rev._id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </>
                  )}
                </Box>
              </motion.div>
            ) : null
          )
        )}
      </AnimatePresence>
    </Box>
  );
};

export default MyReviews;
