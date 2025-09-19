
import React, { useState, useContext, useEffect } from 'react';
import { TextField, Button, Typography, Container, Card, CardContent, Box, Avatar } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useContext(DataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'agent') {
        navigate('/admin-dashboard');
      } else {
        navigate('/daily-schedule');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Card sx={{ 
        mt: 8,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '15px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ color: 'white' }}>
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{
              style: { color: '#ccc' },
            }}
            sx={{
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                    borderColor: 'white',
                    },
                    '&.Mui-focused fieldset': {
                    borderColor: 'white',
                    },
                },
                '& .MuiInputBase-input': {
                    color: 'white',
                },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{
              style: { color: '#ccc' },
            }}
            sx={{
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                    borderColor: 'white',
                    },
                    '&.Mui-focused fieldset': {
                    borderColor: 'white',
                    },
                },
                '& .MuiInputBase-input': {
                    color: 'white',
                },
            }}
          />
          {error && (
              <Typography color="error" variant="body2">
                  {error}
              </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ 
                mt: 3, 
                mb: 2,
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                color: 'white',
                '&:hover': {
                    background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
                }
            }}
          >
            Sign In
          </Button>
          <Box textAlign="center">
            <Link to="/signup" style={{ color: '#aaa' }}>
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Box>
      </Card>
    </Container>
  );
};

export default LoginPage;
