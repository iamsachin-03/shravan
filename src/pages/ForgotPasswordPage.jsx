import React, { useContext, useState } from 'react';
import { Alert, Box, Button, Card, Container, Snackbar, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { DataContext } from '../context/DataContext';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.6)' },
    '&.Mui-focused fieldset': { borderColor: '#f2a541' },
  },
  '& .MuiInputBase-input': { color: 'white' },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.75)' },
};

const ForgotPasswordPage = () => {
  const { requestPasswordReset, resetPassword } = useContext(DataContext);
  const [agentId, setAgentId] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetState, setResetState] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'success', message: '' });

  const showMessage = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  const handleSendOtp = async (event) => {
    event.preventDefault();
    try {
      const result = await requestPasswordReset(agentId);
      setResetState(result);
      showMessage(`OTP sent to ${result.maskedPhone}. Development preview: ${result.otpPreview}`);
    } catch (error) {
      showMessage(error.message, 'error');
    }
  };

  const handleReset = async (event) => {
    event.preventDefault();
    try {
      await resetPassword(agentId, otpCode, newPassword);
      showMessage('Password updated successfully. You can sign in now.');
      setOtpCode('');
      setNewPassword('');
    } catch (error) {
      showMessage(error.message, 'error');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card sx={{ p: 4, borderRadius: 6, background: 'linear-gradient(160deg, rgba(12,18,32,0.95), rgba(28,54,73,0.92))', color: 'white', boxShadow: '0 24px 60px rgba(0,0,0,0.35)' }}>
        <Typography variant="overline" sx={{ letterSpacing: '0.24em', color: '#f2a541' }}>Credential Recovery</Typography>
        <Typography variant="h4" sx={{ fontFamily: 'Georgia, serif', mb: 1 }}>Reset agent password</Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.72)', mb: 3 }}>Only fixed agent accounts are supported. OTP is sent to the admin mobile number on record.</Typography>

        <Box component="form" onSubmit={handleSendOtp} sx={{ display: 'grid', gap: 2, mb: 3 }}>
          <TextField label="Agent ID" value={agentId} onChange={(event) => setAgentId(event.target.value)} required sx={fieldSx} />
          <Button type="submit" variant="contained" sx={{ py: 1.4, background: 'linear-gradient(135deg, #0e6d62, #12a594)' }}>Send OTP</Button>
        </Box>

        {resetState ? (
          <Typography variant="body2" sx={{ color: '#d6f5ef', mb: 2 }}>Registered number: {resetState.maskedPhone}</Typography>
        ) : null}

        <Box component="form" onSubmit={handleReset} sx={{ display: 'grid', gap: 2 }}>
          <TextField label="OTP" value={otpCode} onChange={(event) => setOtpCode(event.target.value)} required sx={fieldSx} />
          <TextField label="New Password" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required sx={fieldSx} />
          <Button type="submit" variant="contained" sx={{ py: 1.4, background: 'linear-gradient(135deg, #f2a541, #ffcb80)', color: '#17212b' }}>Update password</Button>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Link to="/login" style={{ color: '#fff6dd' }}>Back to sign in</Link>
        </Box>
      </Card>

      <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar((current) => ({ ...current, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default ForgotPasswordPage;