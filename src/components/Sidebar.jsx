import React, { useContext } from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Divider, Box, Avatar, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import { Home, Schedule, Assessment, People, Payment, PowerSettingsNew } from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar = ({ handleLogout }) => {
  const { user } = useContext(DataContext);
  const location = useLocation();

  const agentLinks = [
    { text: 'Dashboard', path: '/', icon: <Home /> },
    { text: 'Daily Schedule', path: '/daily-schedule', icon: <Schedule /> },
    { text: 'User Monthly Summary', path: '/user-monthly-summary', icon: <Assessment /> },
    { text: 'All Users', path: '/all-users', icon: <People /> },
    { text: 'Payments', path: '/payments', icon: <Payment /> },
  ];

  const staffLinks = [
    { text: 'Daily Schedule', path: '/', icon: <Schedule /> },
    { text: 'User Monthly Summary', path: '/user-monthly-summary', icon: <Assessment /> },
  ];

  const links = user?.role === 'agent' ? agentLinks : staffLinks;

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1a237e',
          color: '#fff',
        },
      }}
      variant="permanent"
      anchor="left"
    >
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ width: 80, height: 80, mb: 1, backgroundColor: '#7986cb' }} />
            <Typography variant="h6">{user?.email}</Typography>
            <Typography variant="body2" sx={{ color: '#c5cae9' }}>{user?.role}</Typography>
        </Box>
      <Divider sx={{ backgroundColor: '#3f51b5' }} />
      <List>
        {links.map((link) => (
          <ListItemButton 
            component={Link} 
            to={link.path} 
            key={link.text} 
            sx={{
                backgroundColor: location.pathname === link.path ? '#3f51b5' : 'transparent',
                '&:hover': {
                    backgroundColor: '#303f9f',
                },
            }}
          >
            <ListItemIcon sx={{ color: '#c5cae9' }}>{link.icon}</ListItemIcon>
            <ListItemText primary={link.text} />
          </ListItemButton>
        ))}
      </List>
      <Divider sx={{ backgroundColor: '#3f51b5' }} />
      <List>
        <ListItemButton onClick={handleLogout}>
            <ListItemIcon sx={{ color: '#c5cae9' }}><PowerSettingsNew /></ListItemIcon>
            <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
