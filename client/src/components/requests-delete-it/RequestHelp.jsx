import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../../context/AppContext';

const categories = ['Food',
    'Medicine',
    'Shelter',
    'Transport',
    'Education',
    'Clothing',
    'Legal Aid',
    'Financial Support',
    'Mental Health',
    'Employment',
    'Other'];
const priorities = ['low', 'medium', 'high'];

const RequestHelp = () => {
  const { userData } = useContext(AppContent);
  console.log("userData in RequestHelp:", userData)
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    message: '',
    category: '',
    customCategory: '',
    location: '',
    neededBy: '',
    priority: 'medium',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalCategory =
      form.category === 'Other' ? form.customCategory || 'Other' : form.category;

    try {
      const res = await axios.post(
        'http://localhost:5050/help/request',
        {
          title: form.title,
          description: form.description,
          message: form.message,
          category: finalCategory,
          location: form.location,
          neededBy: form.neededBy || null,
          priority: form.priority,
        },
        { withCredentials: true }
      );

      toast.success('Help request submitted!');
      setForm({
        title: '',
        description: '',
        message: '',
        category: '',
        customCategory: '',
        location: '',
        neededBy: '',
        priority: 'medium',
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit request');
    }
  };

  if (!userData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex justify-center items-center px-4"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="p-6 bg-white rounded-lg shadow-xl text-center max-w-md"
        >
          <h2 className="text-2xl font-bold text-red-600 mb-4">🔒 Login Required</h2>
          <p className="text-gray-700 mb-4">
            You need to <span className="text-blue-600 font-semibold">log in</span> before submitting a help request.
          </p>
          <button
            onClick={() => navigate('/login')}
            style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontSize: '16px' }}
          >
            Go to Login
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-purple-100 to-blue-100"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
          📢 Submit a Help Request
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Section title="📄 Request Info">
            <Input label="Title" name="title" value={form.title} onChange={handleChange} required />
            <Textarea
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              required
            />
            <Textarea
              label="Additional Message"
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={2}
            />
          </Section>

          <Section title="📍 Location & Category">
            <Input label="Location" name="location" value={form.location} onChange={handleChange} required />
            <Select
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              options={categories}
              required
            />
            {form.category === 'Other' && (
              <Input
                label="Custom Category"
                name="customCategory"
                value={form.customCategory}
                onChange={handleChange}
              />
            )}
            <Input
              label="Needed By"
              type="date"
              name="neededBy"
              value={form.neededBy}
              onChange={handleChange}
            />
            <Select
              label="Priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              options={priorities}
            />
          </Section>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-600 text-white py-3 px-6 rounded-md shadow-md w-full text-lg"
          >
            🚀 Submit Request
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Reusable Components
const Section = ({ title, children }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-700 mb-3">{title}</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
  </div>
);

const Input = ({ label, name, value, onChange, type = 'text', required = false }) => (
  <div className="flex flex-col">
    <label className="text-gray-600 font-medium mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="p-2 border border-gray-300 rounded-md"
    />
  </div>
);

const Textarea = ({ label, name, value, onChange, rows = 3, required = false }) => (
  <div className="flex flex-col col-span-1 sm:col-span-2">
    <label className="text-gray-600 font-medium mb-1">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      required={required}
      className="p-2 border border-gray-300 rounded-md"
    />
  </div>
);

const Select = ({ label, name, value, onChange, options, required = false }) => (
  <div className="flex flex-col">
    <label className="text-gray-600 font-medium mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="p-2 border border-gray-300 rounded-md"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default RequestHelp;
