import React, { useContext, useMemo, useState } from 'react';
import { Alert, Avatar, Box, Button, Card, Container, Snackbar, TextField, Typography } from '@mui/material';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import ManageSearchRoundedIcon from '@mui/icons-material/ManageSearchRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import { Link, useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';

const buildCaptcha = () => {
  const left = Math.floor(Math.random() * 8) + 1;
  const right = Math.floor(Math.random() * 8) + 1;
  return {
    prompt: `${left} + ${right}`,
    answer: String(left + right),
  };
};

const LoginPage = () => {
  const { login } = useContext(DataContext);
  const navigate = useNavigate();
  const [agentId, setAgentId] = useState('');
  const [password, setPassword] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [captcha, setCaptcha] = useState(buildCaptcha);

  const highlights = useMemo(
    () => [
      { icon: <ShieldRoundedIcon />, text: 'Fixed admin/staff agent IDs with controlled access' },
      { icon: <ManageSearchRoundedIcon />, text: 'Fast search across account number, nominee, mobile, and email' },
      { icon: <TimelineRoundedIcon />, text: 'Monthly summaries generated from daily collection entries' },
    ],
    []
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (captchaAnswer.trim() !== captcha.answer) {
      setError('Captcha answer is incorrect');
      setCaptcha(buildCaptcha());
      setCaptchaAnswer('');
      return;
    }

    try {
      await login(agentId.trim(), password);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Unable to sign in');
      setCaptcha(buildCaptcha());
      setCaptchaAnswer('');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 8 } }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
          gap: 3,
          alignItems: 'stretch',
        }}
      >
        <Card
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 8,
            color: 'white',
            background: 'linear-gradient(160deg, rgba(10,18,29,0.95), rgba(18,40,56,0.92))',
            boxShadow: '0 30px 60px rgba(0,0,0,0.35)',
          }}
        >
          <Typography variant="overline" sx={{ letterSpacing: '0.28em', color: '#f2a541' }}>Shravan Agent Desk</Typography>
          <Typography variant="h2" sx={{ mt: 1, mb: 2, fontFamily: 'Georgia, serif', fontSize: { xs: '2.5rem', md: '4.25rem' }, lineHeight: 0.95 }}>
            Collections, maturity tracking, and user search in one place.
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.74)', maxWidth: 520, mb: 4 }}>
            Sign in with your assigned agent ID, verify the captcha, and manage all accounts tagged under your post office agent profile.
          </Typography>

          <Box sx={{ display: 'grid', gap: 2.5 }}>
            {highlights.map((item) => (
              <Box key={item.text} sx={{ display: 'flex', gap: 2, alignItems: 'center', color: '#eef7ff' }}>
                <Avatar sx={{ bgcolor: 'rgba(242,165,65,0.16)', color: '#f2a541' }}>{item.icon}</Avatar>
                <Typography>{item.text}</Typography>
              </Box>
            ))}
          </Box>
        </Card>

        <Card
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 8,
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'white',
            boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
          }}
        >
          <Avatar sx={{ width: 56, height: 56, mb: 2, bgcolor: '#0e6d62' }}>
            <ShieldRoundedIcon />
          </Avatar>
          <Typography variant="h4" sx={{ fontFamily: 'Georgia, serif' }}>Agent Sign In</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.74)', mb: 3 }}>Use the fixed admin or staff agent account created in your database.</Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
            <TextField label="Agent ID" value={agentId} onChange={(event) => setAgentId(event.target.value)} required sx={fieldStyles} />
            <TextField label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required sx={fieldStyles} />
            <TextField label={`Captcha: ${captcha.prompt}`} value={captchaAnswer} onChange={(event) => setCaptchaAnswer(event.target.value)} required sx={fieldStyles} />

            {error ? <Alert severity="error">{error}</Alert> : null}

            <Button type="submit" variant="contained" sx={{ py: 1.5, mt: 1, background: 'linear-gradient(135deg, #0e6d62, #13a08f)' }}>
              Login
            </Button>
          </Box>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
            <Link to="/forgot-password" style={{ color: '#ffe3b0' }}>Forgot password?</Link>
            <Button variant="text" onClick={() => setSnackbarOpen(true)} sx={{ color: 'white' }}>Need default setup?</Button>
          </Box>
        </Card>
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="info" variant="filled">Seed agent records with fields: agentId, agentName, role, adminPhone, passwordHash, isActive.</Alert>
      </Snackbar>
    </Container>
  );
};

const fieldStyles = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'rgba(255,255,255,0.22)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.55)' },
    '&.Mui-focused fieldset': { borderColor: '#f2a541' },
  },
  '& .MuiInputBase-input': { color: 'white' },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.76)' },
};

export default LoginPage;