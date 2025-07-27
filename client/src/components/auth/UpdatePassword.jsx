import React, { useState } from 'react';
import { TextField, Button, InputAdornment, IconButton } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { ArrowBack, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { GrUpdate } from 'react-icons/gr';
import { motion } from 'framer-motion';

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const toggleVisibility = () => setVisible(prev => !prev);

  const initialState = { password: '' };

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const handleSubmit = (values) => {
    console.log('Updated Password:', values.password);
    // Backend update password call here
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#CDC1F0',
        padding: '16px',
      }}
    >
      <Formik
        initialValues={initialState}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur, touched, errors }) => (
          <Form
            style={{
              width: '100%',
              maxWidth: '420px',
              background: 'white',
              padding: '32px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.div
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                style={{
                  textAlign: 'center',
                  marginBottom: '24px',
                }}
              >
                <GrUpdate size={48} color="#1976d2" />
                <h2 style={{ margin: '8px 0' }}>Update Password</h2>
                <p style={{ color: '#666' }}>Enter your new password</p>
              </motion.div>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              >
                <TextField
                  name="password"
                  label="New Password"
                  type={visible ? 'text' : 'password'}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  size="medium"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={toggleVisibility}>
                          {visible ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  style={{ marginTop: '16px' }}
                >
                  Update Password
                </Button>
              </motion.div>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  size="large"
                  startIcon={<ArrowBack />}
                  onClick={() => navigate('/login')}
                  style={{ marginTop: '12px' }}
                >
                  Back to Login
                </Button>
              </motion.div>
            </motion.div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};

export default UpdatePassword;
