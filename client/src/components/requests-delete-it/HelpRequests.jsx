import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContent } from '../../context/AppContext';
import { motion } from 'framer-motion';

const filterOptions = ['All', 'Food', 'Medicine', 'Education', 'Shelter', 'Clothing', 'Transport', 'Other'];

const HelpRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useContext(AppContent);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get('http://localhost:5050/help/all');
        setRequests(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error('Error fetching help requests:', err);
        toast.error('Failed to fetch requests');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  useEffect(() => {
    let updated = [...requests];
    if (selectedCategory !== 'All') {
      updated = updated.filter((r) => r.category === selectedCategory);
    }
    updated.sort((a, b) =>
      sortOrder === 'newest'
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );
    setFiltered(updated);
  }, [selectedCategory, sortOrder, requests]);

  const handleRespond = (requestId) => {
    toast.info(`Feature to respond to request ${requestId} coming soon.`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    try {
      await axios.delete(`http://localhost:5050/help/${id}`);
      toast.success('Help request deleted');
      setRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete request');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen px-4 py-8 bg-gradient-to-br from-blue-100 to-purple-100"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
          🤝 Community Help Requests
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <label className="font-semibold text-green-700 mr-2">Filter by Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 p-2 rounded-md"
            >
              {filterOptions.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-green-700 mr-2">Sort by:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 p-2 rounded-md"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-center text-green-600 text-lg">Loading help requests...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500">
            <p className="text-2xl mb-2">😕</p>
            <p>No help requests found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((req) => (
              <motion.div
                key={req._id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-orange-50 border-l-4 border-green-500 rounded-lg shadow-md p-5"
              >
                <h3 className="text-xl font-bold text-green-800 mb-2">{req.title}</h3>
                <p className="text-gray-700 mb-2">{req.description}</p>
                {req.message && (
                  <p className="text-sm italic text-gray-500 mb-2">"{req.message}"</p>
                )}
                <div className="text-sm text-gray-700 space-y-1 mb-3">
                  <p><strong>📍 Location:</strong> {req.location}</p>
                  <p><strong>📅 Needed By:</strong> {req.neededBy ? new Date(req.neededBy).toLocaleDateString() : 'N/A'}</p>
                  <p><strong>📤 Submitted:</strong> {new Date(req.createdAt).toLocaleString()}</p>
                  <p><strong>⚡ Priority:</strong> <span className="capitalize">{req.priority}</span></p>
                  <p><strong>🛠️ Status:</strong> {req.status}</p>
                  <p><strong>✔️ Verified:</strong> {req.isVerified ? 'Yes' : 'No'}</p>
                  {req.user && (
                    <p><strong>🙋 User:</strong> {req.user.name || 'Unknown'} ({req.user.email})</p>
                    
                  )}
                  {req.user && (
                    <p><strong>📞 Phone:</strong> {req.user.phone}</p>
                  )}
                  {req.category && (
                    <p><strong>📂 Category:</strong> {req.category}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleRespond(req._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Offer Help
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(req._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default HelpRequests;
