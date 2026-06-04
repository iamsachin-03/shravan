import React, { useContext } from 'react';
import { AppBar, Box, Button, Chip, Toolbar, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(DataContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'rgba(9, 16, 24, 0.72)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <Toolbar sx={{ gap: 2, flexWrap: 'wrap' }}>
        <Typography component={Link} to="/home" sx={{ flexGrow: 1, textDecoration: 'none', color: 'white', fontWeight: 700, letterSpacing: '0.08em' }}>
          SHRAVAN
        </Typography>
        {user ? <Chip label={`${user.agentName || 'Agent'} • ${user.agentId}`} sx={{ bgcolor: 'rgba(242,165,65,0.16)', color: '#fff1d4' }} /> : null}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button sx={{ color: 'white' }} component={Link} to="/home">Home</Button>
          <Button sx={{ color: 'white' }} component={Link} to="/daily-schedule">Daily Schedule</Button>
          <Button sx={{ color: 'white' }} component={Link} to="/summary">Monthly Summary</Button>
          <Button sx={{ color: 'white' }} component={Link} to="/users">Users</Button>
          <Button sx={{ color: 'white' }} component={Link} to="/create-user">Create User</Button>
          <Button sx={{ color: '#ffd6d6' }} onClick={handleLogout}>Logout</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;