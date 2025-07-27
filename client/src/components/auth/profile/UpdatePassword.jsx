import React, { useState } from 'react';
import { TextField, Button, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const UpdatePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  const handleToggle = () => setShowPassword((prev) => !prev);

  const handleSubmit = () => {
    console.log('New Password:', password);
    // backend call
  };

  return (
    <div>
      <h3>Update Password</h3>
      <TextField
        label="New Password"
        type={showPassword ? 'text' : 'password'}
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleToggle}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button variant="contained" onClick={handleSubmit}>Save</Button>
    </div>
  );
};

export default UpdatePassword;
