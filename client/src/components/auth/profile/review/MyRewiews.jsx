import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment';
import { motion, AnimatePresence } from 'framer-motion';
import apis from '../../../../assets/utils/apis';
import httpAction from '../../../../assets/utils/httpAction';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [editedRating, setEditedRating] = useState(5);

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

  const containerStyle = { padding: 20, maxWidth: 800, margin: '0 auto' };
  const cardStyle = { marginBottom: 20, padding: 16, borderRadius: 12, background: '#f9f9f9', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' };
  const avatarStyle = { width:40, height:40, borderRadius:'50%', background:'#bbb', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:'bold', fontSize:16 };
  const buttonStyle = { padding:'6px 12px', borderRadius:6, border:'none', cursor:'pointer', fontSize:14 };
  const saveBtnStyle = { ...buttonStyle, background:'#4CAF50', color:'#fff' };
  const cancelBtnStyle = { ...buttonStyle, background:'#ccc', color:'#000' };
  const editBtnStyle = { ...buttonStyle, background:'#2196F3', color:'#fff' };
  const deleteBtnStyle = { ...buttonStyle, background:'#f44336', color:'#fff' };
  const inputStyle = { width:'100%', padding:8, borderRadius:6, border:'1px solid #ccc', marginBottom:8 };

  return (
    <div style={containerStyle}>
      <motion.h2
        initial={{ opacity:0, y:-10 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.4 }}
        style={{ fontSize:24, fontWeight:600, marginBottom:20, textAlign:'center' }}
      >
        My Reviews
      </motion.h2>

      <AnimatePresence>
        {reviews.length === 0 ? (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ textAlign:'center' }}>
            <p style={{ color:'#555' }}>You haven't written any reviews yet.</p>
          </motion.div>
        ) : (
          reviews.map(rev =>
            rev && rev._id ? (
              <motion.div
                key={rev._id}
                layout
                initial={{ opacity:0, y:10 }}
                animate={{ opacity:1, y:0 }}
                exit={{ opacity:0, y:-10 }}
                transition={{ duration:0.2 }}
                style={cardStyle}
              >
                {/* Header */}
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
                  <div style={avatarStyle}>{rev.user?.name?.charAt(0) || 'U'}</div>
                  <div>
                    <div style={{ fontWeight:600 }}>{rev.user?.name || 'You'}</div>
                    <div style={{ fontSize:12, color:'gray' }}>{moment(rev.createdAt).fromNow()}</div>
                  </div>
                </div>

                {/* Content */}
                {editingId === rev._id ? (
                  <div>
                    <textarea
                      value={editedContent || ''}
                      onChange={(e) => setEditedContent(e.target.value)}
                      rows={3}
                      style={inputStyle}
                    />
                    <div style={{ marginBottom:8 }}>
                      <label>Rating: </label>
                      <input
                        type="number"
                        min={1} max={5}
                        value={editedRating}
                        onChange={(e) => setEditedRating(Number(e.target.value))}
                        style={{ width:50, padding:4, marginLeft:8 }}
                      />
                    </div>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      <button style={saveBtnStyle} onClick={() => handleEdit(rev._id)}>Save</button>
                      <button style={cancelBtnStyle} onClick={() => setEditingId(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p style={{ marginTop:4, marginBottom:8, wordBreak:'break-word' }}>{rev.content || 'No content provided.'}</p>
                    <p style={{ marginBottom:8 }}>Rating: {rev.rating || 0} / 5</p>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      <button style={editBtnStyle} onClick={() => { setEditingId(rev._id); setEditedContent(rev.content || ''); setEditedRating(rev.rating || 5); }}>Edit</button>
                      <button style={deleteBtnStyle} onClick={() => handleDelete(rev._id)}>Delete</button>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : null
          )
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyReviews;
