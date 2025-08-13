import React, { useEffect, useState } from 'react';
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
    return (
      <div
        style={{
          width: '100%',
          textAlign: 'center',
          padding: '20px',
          fontFamily: 'Segoe UI, Roboto, sans-serif',
          fontSize: '1rem',
          color: '#555',
        }}
      >
        ⏳ Loading reviews...
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '900px',
        margin: '0 auto',
        padding: '16px',
        fontFamily: 'Segoe UI, Roboto, sans-serif',
      }}
    >
      <h2
        style={{
          fontSize: '1.8rem',
          marginBottom: '20px',
          textAlign: 'center',
          color: '#333',
        }}
      >
        🗣️ What People Are Saying
      </h2>

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
              border: '1px solid #ddd',
              borderRadius: '12px',
              backgroundColor: '#f9f9f9',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              wordBreak: 'break-word',
            }}
          >
            {/* User Info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#5bdd51',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  flexShrink: 0,
                }}
              >
                {review.user?.name?.charAt(0) || 'U'}
              </div>
              <div style={{ flex: 1, minWidth: '150px' }}>
                <div style={{ fontWeight: 600, color: '#333' }}>
                  {review.user?.name || 'Anonymous'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#888' }}>
                  📅 {moment(review.createdAt).fromNow()}
                </div>
              </div>
            </div>

            {/* Review Content */}
            <p
              style={{
                marginTop: '12px',
                marginBottom: '8px',
                fontSize: '1rem',
                color: '#444',
              }}
            >
              💬 {review.content}
            </p>

            {/* Rating */}
            <div style={{ display: 'flex', gap: '2px' }}>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <span
                    key={i}
                    style={{
                      color: i < (review.rating || 0) ? '#FFD700' : '#ccc',
                      fontSize: '1.1rem',
                    }}
                  >
                    ⭐
                  </span>
                ))}
              <span style={{ marginLeft: '8px', fontSize: '0.9rem', color: '#555' }}>
                ({review.rating || 0}/5)
              </span>
            </div>
          </motion.div>
        ) : null
      )}
    </div>
  );
};

export default AllReviews;
