import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../../../../context/AppContext';

const categories = [
  'Food','Medicine','Shelter','Transport','Education','Clothing',
  'Legal Aid','Financial Support','Mental Health','Employment','Other'
];
const priorities = ['low', 'medium', 'high'];

const RequestHelp = () => {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '', description: '', message: '', category: '', customCategory: '',
    location: '', neededBy: '', priority: 'medium',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalCategory = form.category === 'Other' ? form.customCategory || 'Other' : form.category;

    try {
      await axios.post(
        'http://localhost:5050/help/request',
        { ...form, category: finalCategory, neededBy: form.neededBy || null },
        { withCredentials: true }
      );
      toast.success('✅ Help request submitted!');
      setForm({ title:'', description:'', message:'', category:'', customCategory:'', location:'', neededBy:'', priority:'medium' });
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to submit request');
    }
  };

  if (!userData) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight:'100vh', display:'flex', justifyContent:'center', alignItems:'center', padding:20 }}>
        <motion.div initial={{ scale:0.9 }} animate={{ scale:1 }} style={{ background:'#fff', padding:30, borderRadius:10, boxShadow:'0 4px 12px rgba(0,0,0,0.2)', textAlign:'center', maxWidth:400 }}>
          <h2 style={{ fontSize:24, color:'#E53935', marginBottom:16 }}>🔒 Login Required</h2>
          <p style={{ color:'#555', marginBottom:20 }}>You need to <span style={{ color:'#1E88E5', fontWeight:'bold' }}>log in</span> before submitting a help request.</p>
          <button
            onClick={() => navigate('/login')}
            style={{ backgroundColor:'#4CAF50', color:'#fff', padding:'10px 20px', border:'none', borderRadius:5, cursor:'pointer', fontSize:16 }}
          >
            Go to Login
          </button>
        </motion.div>
      </motion.div>
    );
  }

  const containerStyle = { minHeight:'100vh', display:'flex', justifyContent:'center', alignItems:'center', padding:20, background:'linear-gradient(135deg, #D1C4E9, #BBDEFB)' };
  const cardStyle = { width:'100%', maxWidth:700, background:'#fff', borderRadius:12, padding:30, boxShadow:'0 8px 24px rgba(0,0,0,0.2)' };
  const inputStyle = { padding:10, borderRadius:6, border:'1px solid #ccc', width:'100%', fontSize:14 };
  const labelStyle = { marginBottom:6, fontWeight:'bold', color:'#555', display:'block' };
  const sectionStyle = { marginBottom:20 };
  const buttonStyle = { backgroundColor:'#43A047', color:'#fff', padding:'12px 0', border:'none', borderRadius:8, fontSize:16, fontWeight:'bold', cursor:'pointer', width:'100%' };

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:1 }} style={containerStyle}>
      <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ duration:0.6 }} style={cardStyle}>
        <h2 style={{ fontSize:28, color:'#2E7D32', marginBottom:24, textAlign:'center' }}>📢 Submit a Help Request</h2>
        <form onSubmit={handleSubmit}>
          
          <div style={sectionStyle}>
            <h3 style={{ fontSize:18, fontWeight:'bold', marginBottom:12 }}>📄 Request Info</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:12 }}>
              <div>
                <label style={labelStyle}>Title</label>
                <input name="title" value={form.title} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Additional Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={2} style={inputStyle} />
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <h3 style={{ fontSize:18, fontWeight:'bold', marginBottom:12 }}>📍 Location & Category</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:12 }}>
              <div>
                <label style={labelStyle}>Location</label>
                <input name="location" value={form.location} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <select name="category" value={form.category} onChange={handleChange} required style={inputStyle}>
                  <option value="">Select Category</option>
                  {categories.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              {form.category === 'Other' && (
                <div>
                  <label style={labelStyle}>Custom Category</label>
                  <input name="customCategory" value={form.customCategory} onChange={handleChange} style={inputStyle} />
                </div>
              )}
              <div>
                <label style={labelStyle}>Needed By</label>
                <input type="date" name="neededBy" value={form.neededBy} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Priority</label>
                <select name="priority" value={form.priority} onChange={handleChange} style={inputStyle}>
                  {priorities.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          </div>

          <motion.button type="submit" whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }} style={buttonStyle}>
            🚀 Submit Request
          </motion.button>

        </form>
      </motion.div>
    </motion.div>
  );
};

export default RequestHelp;
