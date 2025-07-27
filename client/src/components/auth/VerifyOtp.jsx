import React from 'react';
import { TextField, Button } from '@mui/material';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { ArrowBack } from '@mui/icons-material';
import Countdown from 'react-countdown';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// OTP config
const otpFields = ['otp1', 'otp2', 'otp3', 'otp4', 'otp5', 'otp6'];
const initialState = Object.fromEntries(otpFields.map(key => [key, '']));
const validationSchema = Yup.object(
  Object.fromEntries(otpFields.map(key => [key, Yup.string().required('')]))
);

// Focus helpers
const focusInput = (index) => {
  const input = document.getElementById(`otp-${index}`);
  if (input) input.focus();
};

const handleKeyDown = (e, index, values, setFieldValue) => {
  if (e.key === 'Backspace') {
    if (!values[otpFields[index]] && index > 0) {
      setFieldValue(otpFields[index - 1], '');
      focusInput(index - 1);
    }
  } else if (e.key === 'ArrowLeft' && index > 0) {
    focusInput(index - 1);
  } else if (e.key === 'ArrowRight' && index < otpFields.length - 1) {
    focusInput(index + 1);
  }
};

const handleChange = (e, index, setFieldValue) => {
  const value = e.target.value.replace(/[^0-9]/g, '');
  setFieldValue(otpFields[index], value);
  if (value && index < otpFields.length - 1) {
    focusInput(index + 1);
  }
};

const handlePaste = (e, setFieldValue) => {
  const pasted = e.clipboardData.getData('Text').replace(/\D/g, '');
  otpFields.forEach((field, i) => {
    setFieldValue(field, pasted[i] || '');
  });
  focusInput(Math.min(pasted.length, otpFields.length - 1));
};

// Main component
const VerifyOtp = () => {
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    const otp = otpFields.map(field => values[field]).join('');
    console.log('Submitted OTP:', otp);
    // Call your verify API here
  };

  return (
    <motion.div
      className="auth_card"
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
        {({ values, handleBlur, errors, touched, setFieldValue }) => (
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
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
              }}
            >
              <motion.div
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                style={{
                  textAlign: 'center',
                  marginBottom: '24px',
                }}
              >
                <h2 style={{ margin: '0 0 8px' }}>Verify OTP</h2>
                <p style={{ color: '#555' }}>Enter the OTP sent to your email</p>
              </motion.div>

              <div
                className="otp_inputs"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '10px',
                  marginBottom: '24px',
                }}
              >
                {otpFields.map((field, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                  >
                    <TextField
                      id={`otp-${index}`}
                      name={field}
                      type="text"
                      value={values[field]}
                      onChange={(e) => handleChange(e, index, setFieldValue)}
                      onKeyDown={(e) => handleKeyDown(e, index, values, setFieldValue)}
                      onPaste={(e) => handlePaste(e, setFieldValue)}
                      onBlur={handleBlur}
                      error={touched[field] && Boolean(errors[field])}
                      inputProps={{
                        maxLength: 1,
                        style: {
                          width: '3rem',
                          height: '3rem',
                          textAlign: 'center',
                          fontSize: '1.5rem',
                          padding: 0,
                        },
                      }}
                      size="small"
                      variant="outlined"
                    />
                  </motion.div>
                ))}
              </div>

              <motion.div
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={Object.values(values).some(val => !val)}
                >
                  Verify OTP
                </Button>
              </motion.div>

              <motion.div
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  size="large"
                  style={{ marginTop: '12px' }}
                  startIcon={<ArrowBack />}
                  onClick={() => navigate('/login')}
                >
                  Back to Login
                </Button>
              </motion.div>

              <motion.div
                className="text-center mt-3"
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              >
                <Countdown
                  date={Date.now() + 60 * 1000}
                  renderer={({ minutes, seconds, completed }) =>
                    completed ? (
                      <Button variant="text" size="small">Resend OTP</Button>
                    ) : (
                      <span style={{ color: '#555' }}>
                        Resend OTP in {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                      </span>
                    )
                  }
                />
              </motion.div>
            </motion.div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};

export default VerifyOtp;
