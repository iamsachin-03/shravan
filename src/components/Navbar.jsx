
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await auth.signOut();
        navigate('/login');
    };

    return (
        <AppBar position="static" sx={{ 
            background: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
            <Toolbar>
                <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}>
                    Agent Portal
                </Typography>
                <Box>
                    <Button sx={{ color: 'white' }} component={Link} to="/daily-schedule">Daily Schedule</Button>
                    <Button sx={{ color: 'white' }} component={Link} to="/summary">Monthly Summary</Button>
                    <Button sx={{ color: 'white' }} component={Link} to="/users">Users</Button>
                    <Button sx={{ color: 'white' }} component={Link} to="/create-user">Create User</Button>
                    <Button sx={{ color: 'white' }} onClick={handleLogout}>Logout</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
