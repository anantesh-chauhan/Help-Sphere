import React, { useState } from 'react';
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { IoPersonAdd } from 'react-icons/io5';
import { ArrowBack, Google, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import apis from '../../assets/utils/apis';
import httpAction from '../../assets/utils/httpAction';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const initialState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
  });

  const handleSubmit = async (values) => {
    const data = { url: apis().registerUser, method: 'POST', body: values };
    const result = await httpAction(data);
    if (result?.success) {
      toast.success('✅ Registration successful!');
      navigate('/login');
    } else {
      toast.error('❌ Registration failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '16px',
        background: '#CDC1F0',
      }}
    >
      <Formik initialValues={initialState} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values, handleChange, handleBlur, errors, touched }) => (
          <Form
            style={{
              width: '100%',
              maxWidth: '440px',
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
                variants={{ hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0 } }}
                style={{ textAlign: 'center', marginBottom: '24px' }}
              >
                <IoPersonAdd size={48} color="#1976d2" />
                <h2 style={{ margin: '8px 0' }}>📝 Register</h2>
                <p style={{ color: '#666' }}>Create a new account ✨</p>
              </motion.div>

              {[{ name: 'name', label: 'Name 🧑', type: 'text' }, { name: 'email', label: 'Email 📧', type: 'email' }].map(({ name, label, type }) => (
                <motion.div key={name} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                  <TextField
                    name={name}
                    label={label}
                    type={type}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={values[name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched[name] && Boolean(errors[name])}
                    helperText={touched[name] && errors[name]}
                  />
                </motion.div>
              ))}

              {/* Password Field */}
              <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                <TextField
                  name="password"
                  label="Password 🔒"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePasswordVisibility}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                <TextField
                  name="confirmPassword"
                  label="Confirm Password 🔒"
                  type={showConfirmPassword ? 'text' : 'password'}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={toggleConfirmPasswordVisibility}>
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                <Button type="submit" variant="contained" fullWidth size="large" style={{ marginTop: '16px' }}>
                  📝 Register
                </Button>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                <Divider style={{ margin: '24px 0' }}>OR</Divider>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  endIcon={<Google />}
                  onClick={() => (window.location.href = 'http://localhost:5050/auth/google')}
                  style={{ marginBottom: '12px' }}
                >
                  🌎 Register with Google
                </Button>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  startIcon={<ArrowBack />}
                  onClick={() => navigate('/login')}
                >
                  🔙 Back to Login
                </Button>
              </motion.div>
            </motion.div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};

export default Register;
