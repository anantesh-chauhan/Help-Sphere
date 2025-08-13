import React from 'react';
import { TextField, Button } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { GrPowerReset } from 'react-icons/gr';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const initialState = {
    email: ''
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required')
  });

  const handleSubmit = (values) => {
    console.log('📧 Forgot Password Request:', values);
    navigate('/verify-otp');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        width: '100vw',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#CDC1F0',
        padding: '20px',
      }}
    >
      <motion.div
        style={{
          maxWidth: '400px',
          width: '100%',
          background: 'white',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        }}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Formik
          initialValues={initialState}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur, errors, touched }) => (
            <Form>
              <motion.div
                style={{
                  textAlign: 'center',
                  marginBottom: '20px',
                  color: '#333',
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GrPowerReset size={30} />
                <h2 style={{ margin: '10px 0' }}>🔄 Forgot Password</h2>
                <p style={{ fontSize: '14px' }}>📧 Enter your registered email</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <TextField
                  name="email"
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                style={{ marginTop: '10px' }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                >
                  ✉️ Send Reset OTP
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{ marginTop: '15px' }}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  size="large"
                  startIcon={<ArrowBack />}
                  onClick={() => navigate('/login')}
                >
                  🔙 Back to Login
                </Button>
              </motion.div>
            </Form>
          )}
        </Formik>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPassword;
