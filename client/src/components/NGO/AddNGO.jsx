import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const AddNGO = () => {
  const [ngo, setNgo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    registrationNumber: '',
    foundedYear: '',
    mission: '',
    type: '',
    website: ''
  });

  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleChange = (e) => {
    setNgo({ ...ngo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHasError(false);

    try {
      await axios.post('http://localhost:5050/ngo/add-ngo', ngo);
      toast.success('NGO added successfully!');
      setNgo({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        registrationNumber: '',
        foundedYear: '',
        mission: '',
        type: '',
        website: ''
      });
    } catch (err) {
      console.error(err);
      setHasError(true);
      toast.error('Failed to add NGO. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          .ngo-container {
            max-width: 1100px;
            margin: 40px auto;
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }

          .ngo-header {
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            color: #2f855a;
            margin-bottom: 30px;
          }

          .ngo-form {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 20px;
          }

          .ngo-field {
            display: flex;
            flex-direction: column;
          }

          .ngo-label {
            margin-bottom: 6px;
            font-weight: 600;
            color: #2f855a;
          }

          .ngo-input {
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 15px;
          }

          .ngo-error {
            background-color: #FED7D7;
            color: #C53030;
            padding: 12px;
            border-radius: 6px;
            text-align: center;
            font-weight: bold;
            margin-bottom: 20px;
          }

          .ngo-submit {
            grid-column: 1 / -1;
            padding: 12px;
            background-color: #2f855a;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.3s ease;
          }

          .ngo-submit:hover {
            background-color: #276749;
          }

          .ngo-submit:disabled {
            background-color: #A0AEC0;
            cursor: not-allowed;
          }

          @media (max-width: 600px) {
            .ngo-form {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      <motion.div
        className="ngo-container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="ngo-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          🏢 Add New NGO
        </motion.h2>

        {hasError && (
          <motion.div className="ngo-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Something went wrong. Please try again later.
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="ngo-form">
          {[
            ['name', 'NGO Name'],
            ['email', 'Email'],
            ['phone', 'Phone'],
            ['address', 'Address'],
            ['city', 'City'],
            ['registrationNumber', 'Registration Number'],
            ['foundedYear', 'Founded Year'],
            ['mission', 'Mission'],
            ['type', 'NGO Type'],
            ['website', 'Website']
          ].map(([key, label]) => (
            <div key={key} className="ngo-field">
              <label className="ngo-label">{label}</label>
              <input
                type={key === 'foundedYear' ? 'number' : 'text'}
                name={key}
                value={ngo[key]}
                onChange={handleChange}
                className="ngo-input"
                required
              />
            </div>
          ))}

          <motion.button
            type="submit"
            disabled={loading}
            className="ngo-submit"
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: loading ? 1 : 1.02 }}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </motion.button>
        </form>
      </motion.div>
    </>
  );
};

export default AddNGO;
