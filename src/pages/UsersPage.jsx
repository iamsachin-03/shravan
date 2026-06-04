import React, { useMemo, useState, useContext } from 'react';
import { TextField, Typography, Container, Card, CardContent, Box, CircularProgress, Grid, Button, Avatar } from '@mui/material';
import { format } from 'date-fns';
import { useNavigate, Link } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import PhoneAndroid from '@mui/icons-material/PhoneAndroid';
import Home from '@mui/icons-material/Home';
import Person from '@mui/icons-material/Person';
import Event from '@mui/icons-material/Event';
import MonetizationOn from '@mui/icons-material/MonetizationOn';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { DataContext } from '../context/DataContext';

const UsersPage = () => {
  const { user, users, loading } = useContext(DataContext);
  const [filters, setFilters] = useState({
    accountNumber: '',
    firstName: '',
    mobileNumber: '',
    email: '',
    nomineeName: '',
  });
  const navigate = useNavigate();

  const filteredUsers = useMemo(() => {
    return users.filter((item) => {
      return (
        (!filters.accountNumber || String(item.accountNumber || '').toLowerCase().includes(filters.accountNumber.toLowerCase())) &&
        (!filters.firstName || String(item.firstName || '').toLowerCase().includes(filters.firstName.toLowerCase())) &&
        (!filters.mobileNumber || String(item.mobileNumber || '').includes(filters.mobileNumber)) &&
        (!filters.email || String(item.email || '').toLowerCase().includes(filters.email.toLowerCase())) &&
        (!filters.nomineeName || String(item.nomineeName || '').toLowerCase().includes(filters.nomineeName.toLowerCase()))
      );
    });
  }, [filters, users]);

  const iconStyle = { color: '#1976d2', mr: 1 };

  if (loading || !user) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: 'white' }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Card sx={{ background: 'white', borderRadius: '12px', color: 'black', p: 3, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold', textTransform: 'uppercase' }}>
            Manage Users
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}><TextField label="Account ID" fullWidth value={filters.accountNumber} onChange={(event) => setFilters((current) => ({ ...current, accountNumber: event.target.value }))} /></Grid>
            <Grid item xs={12} md={4}><TextField label="First Name" fullWidth value={filters.firstName} onChange={(event) => setFilters((current) => ({ ...current, firstName: event.target.value }))} /></Grid>
            <Grid item xs={12} md={4}><TextField label="Mobile" fullWidth value={filters.mobileNumber} onChange={(event) => setFilters((current) => ({ ...current, mobileNumber: event.target.value }))} /></Grid>
            <Grid item xs={12} md={6}><TextField label="Email" fullWidth value={filters.email} onChange={(event) => setFilters((current) => ({ ...current, email: event.target.value }))} /></Grid>
            <Grid item xs={12} md={6}><TextField label="Nominee Name" fullWidth value={filters.nomineeName} onChange={(event) => setFilters((current) => ({ ...current, nomineeName: event.target.value }))} /></Grid>
          </Grid>
          <Grid container spacing={3} direction="column">
            {filteredUsers.map((u) => (
              <Grid item xs={12} key={u.id}>
                <Card
                  sx={{
                    background: 'linear-gradient(145deg, #f9f9f9, #ffffff)',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 8px 24px 0 rgba(0,0,0,0.12)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 32px 0 rgba(0,0,0,0.18)',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={2} container justifyContent="center" alignItems="flex-start">
                        <Avatar sx={{ width: 60, height: 60, bgcolor: '#1976d2', fontSize: '1.5rem' }}>
                          {u.firstName && u.firstName.charAt(0)}{u.lastName && u.lastName.charAt(0)}
                        </Avatar>
                      </Grid>
                      <Grid item xs={12} sm={10}>
                        <Typography variant="h6" component={Link} to={`/user-details/${u.id}`} sx={{ color: 'black', textDecoration: 'none', fontWeight: 'bold', '&:hover': { textDecoration: 'underline' }, display: 'flex', alignItems: 'center' }}>
                          <AccountCircle sx={iconStyle} /> A/C: {u.accountNumber}
                        </Typography>
                        <Box sx={{ mt: 2, pl: 1 }}>
                          <Typography variant="body1" sx={{ color: 'black', display: 'flex', alignItems: 'center', mb: 1 }}><Person sx={iconStyle} /> {u.firstName} {u.lastName}</Typography>
                          <Typography variant="body2" sx={{ color: '#555', display: 'flex', alignItems: 'center', mb: 1 }}><Person sx={iconStyle} /> Nominee: {u.nomineeName}</Typography>
                          <Typography variant="body2" sx={{ color: '#555', display: 'flex', alignItems: 'center', mb: 1 }}><PhoneAndroid sx={iconStyle} /> Mobile: {u.mobileNumber}</Typography>
                          <Typography variant="body2" sx={{ color: '#555', display: 'flex', alignItems: 'center', mb: 1 }}><AlternateEmailIcon sx={iconStyle} /> Email: {u.email || 'N/A'}</Typography>
                          <Typography variant="body2" sx={{ color: '#555', display: 'flex', alignItems: 'center', mb: 1 }}><MonetizationOn sx={iconStyle} /> Denomination: {u.denomination}</Typography>
                          <Typography variant="body2" sx={{ color: '#555', display: 'flex', alignItems: 'flex-start', mt: 1, mb: 1 }}><Home sx={iconStyle} /> Address: <Box component="span" sx={{ pl: 0.5, wordBreak: 'break-word' }}>{u.address}</Box></Typography>
                          <Typography variant="body2" sx={{ color: '#555', display: 'flex', alignItems: 'center', mt: 1 }}><Event sx={iconStyle} /> Opened: {u.accountOpeningDate?.toDate ? format(u.accountOpeningDate.toDate(), 'dd/MM/yyyy') : 'N/A'}</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardContent sx={{ pt: 0, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" size="small" onClick={() => navigate(`/user-details/${u.id}`)} sx={{ background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)', color: 'white', boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)' }}>
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UsersPage;