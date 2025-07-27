import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContent } from '../../context/AppContext';
import { motion } from 'framer-motion';
import { FaGlobe, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaTrashAlt, FaBuilding } from 'react-icons/fa';

const ViewNgos = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { isAdmin } = useContext(AppContent);

  useEffect(() => {
    fetchNgos();
  }, []);

  const fetchNgos = async () => {
    try {
      const res = await axios.get('http://localhost:5050/ngo/view-ngos');
      setNgos(res.data);
      setHasError(false);
    } catch (err) {
      console.error('Error fetching NGOs:', err);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this NGO?')) return;
    try {
      await axios.delete(`http://localhost:5050/ngo/delete-ngo/${id}`);
      toast.success('NGO deleted successfully');
      setNgos(ngos.filter((n) => n._id !== id));
    } catch (err) {
      console.error('Error deleting NGO:', err);
      toast.error('Failed to delete NGO');
    }
  };

  return (
    <>
      <style>{`
        .view-container { max-width:1100px; margin:60px auto; padding:20px; }
        .view-heading { text-align:center; font-size:28px; font-weight:bold; color:#2f855a; margin-bottom:30px; }
        .view-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:20px; }
        .ngo-card { position:relative; background:white; border:1px solid #dcdcdc; border-radius:10px; padding:20px; box-shadow:0 4px 12px rgba(0,0,0,0.05); transition:box-shadow .3s; }
        .ngo-card:hover { box-shadow:0 6px 18px rgba(0,0,0,0.1); }
        .ngo-title { display:flex; align-items:center; font-size:20px; font-weight:bold; margin-bottom:12px; color:#2f855a; }
        .ngo-title svg { margin-right:8px; color:#2f855a; }
        .ngo-info { display:flex; align-items:center; margin:6px 0; font-size:15px; color:#4a5568; }
        .ngo-info svg { margin-right:6px; color:rgba(19, 233, 101, 0.5); }
        .ngo-link { color:#3182ce; text-decoration:underline; }
        .delete-btn { position:absolute; top:12px; right:12px; background:#e53e3e; color:white; border:none; padding:6px 10px; border-radius:4px; cursor:pointer; font-size:13px; display:flex; align-items:center; }
        .delete-btn:hover { background:#c53030; }
        .loading-box { text-align:center; margin-top:100px; }
        .spinner { display:inline-block; width:40px; height:40px; border:4px solid #c6f6d5; border-top-color:#2f855a; border-radius:50%; animation:spin 1s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
        .error-message, .no-data { text-align:center; margin-top:100px; color:#c53030; font-size:18px; }
      `}</style>

      {loading ? (
        <div className="loading-box">
          <div className="spinner"></div>
          <p style={{ color: '#2f855a', marginTop: '10px' }}>Loading NGOs...</p>
        </div>
      ) : hasError ? (
        <div className="error-message">
          <h2>Something went wrong</h2>
          <p>Please try refreshing or come back later.</p>
        </div>
      ) : (
        <div className="view-container">
          <h2 className="view-heading">Registered NGOs</h2>
          {ngos.length === 0 ? (
            <p className="no-data">No NGOs found.</p>
          ) : (
            <div className="view-grid">
              {ngos.map((ngo) => (
                <div key={ngo._id} className="ngo-card">
                  <div className="ngo-title">
                    <FaBuilding /> {ngo.name}
                  </div>
                  <div className="ngo-info"><FaEnvelope /> {ngo.email}</div>
                  <div className="ngo-info"><FaPhoneAlt /> {ngo.phone}</div>
                  <div className="ngo-info"><FaMapMarkerAlt /> {ngo.city}</div>
                  <div className="ngo-info"><strong>Founded:</strong> {ngo.foundedYear}</div>
                  <div className="ngo-info"><strong>Reg#:</strong> {ngo.registrationNumber}</div>
                  <div className="ngo-info"><strong>Type:</strong> {ngo.type}</div>
                  <div className="ngo-info"><strong>Mission:</strong> {ngo.mission}</div>
                  {ngo.website && (
                    <div className="ngo-info">
                      <FaGlobe />
                      <a href={ngo.website} target="_blank" rel="noopener noreferrer" className="ngo-link">
                        {ngo.website}
                      </a>
                    </div>
                  )}
                  {isAdmin && (
                    <motion.button
                      className="delete-btn"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(ngo._id)}
                    >
                      <FaTrashAlt style={{ marginRight: '4px' }} />Delete
                    </motion.button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ViewNgos;
