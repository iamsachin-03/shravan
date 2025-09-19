
import React, { useState, useContext, useEffect } from 'react';
import { TextField, Button, Typography, Container, Card, CardContent, Grid, Box, Avatar } from '@mui/material';
import { LockOutlined, Google, Facebook } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup, user } = useContext(DataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/daily-schedule');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(email, password);
    } catch (err) {
      setError('Failed to create an account');
    }
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
        <Grid 
            item 
            xs={false}
            sm={4}
            md={7}
            sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            }}
        />
        <Grid item xs={12} sm={8} md={5} component={Card} elevation={6} square
          sx={{
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(10px)',
          }}
        >
            <Box
            sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: 'white',
            }}
            >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlined />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign up
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
                Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <Link to="/" style={{ color: '#aaa' }}>
                            {"Already have an account? Sign in"}
                        </Link>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#ccc' }}>
                        Or sign up with
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                        <Button variant="outlined" startIcon={<Google />} sx={{ color: 'white', borderColor: 'white' }}>Google</Button>
                        <Button variant="outlined" startIcon={<Facebook />} sx={{ color: 'white', borderColor: 'white' }}>Facebook</Button>
                    </Box>
                </Box>
            </Box>
            </Box>
        </Grid>
    </Grid>
  );
};

export default SignUpPage;
