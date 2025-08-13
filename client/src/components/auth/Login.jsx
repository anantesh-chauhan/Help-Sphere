import React, { useState, useContext } from 'react';
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import { Visibility, VisibilityOff, Google, ArrowBack } from '@mui/icons-material';
import { IoIosLogIn } from 'react-icons/io';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import apis from '../../assets/utils/apis';
import httpAction from '../../assets/utils/httpAction';
import { toast } from 'react-toastify';
import { AppContent } from '../../context/AppContext';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const { setUser } = useContext(AppContent);

  const loginWithGoogle = () => {
    window.location.href = 'http://localhost:5050/auth/google';
  };

  const initialState = { email: '', password: '' };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const handleSubmit = async (values) => {
    const data = { url: apis().loginUser, method: 'POST', body: values };
    const result = await httpAction(data);

    if (result.success) {
      setUser?.(result.user);
      toast.success('✅ Logged in successfully!');
      navigate('/profile');
    } else {
      toast.error(result.error || '❌ Login failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
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
                variants={{ hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0 } }}
                style={{ textAlign: 'center', marginBottom: '24px' }}
              >
                <IoIosLogIn size={48} color="#1976d2" />
                <h2 style={{ margin: '8px 0' }}>👋 Welcome back!</h2>
                <p style={{ color: '#666' }}>🔑 Login to continue</p>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                <TextField
                  name="email"
                  label="Email 📧"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                <TextField
                  name="password"
                  label="Password 🔒"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type={visible ? 'text' : 'password'}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton edge="end" onClick={() => setVisible(!visible)}>
                          {visible ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                <Button type="submit" variant="contained" fullWidth size="large" style={{ marginTop: '16px' }}>
                  🔑 Login
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
                  onClick={loginWithGoogle}
                  style={{ marginBottom: '12px' }}
                >
                  🌎 Login with Google
                </Button>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  startIcon={<ArrowBack />}
                  onClick={() => navigate('/register')}
                  style={{ marginBottom: '12px' }}
                >
                  🆕 Create new account
                </Button>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                <Button
                  variant="text"
                  color="error"
                  fullWidth
                  onClick={() => navigate('/forgot-password')}
                >
                  ❓ Forgot Password?
                </Button>
              </motion.div>
            </motion.div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};

export default Login;
