import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Avatar, Box, Button, Card, CardContent, Chip, Container, Grid, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import { Link } from 'react-router-dom';
import { DataContext } from '../context/DataContext';

const monthsUntilMaturity = (accountOpeningDate) => {
  if (!accountOpeningDate?.toDate && !(accountOpeningDate instanceof Date)) return null;
  const opening = accountOpeningDate.toDate ? accountOpeningDate.toDate() : accountOpeningDate;
  const now = new Date();
  const monthsElapsed = (now.getFullYear() - opening.getFullYear()) * 12 + (now.getMonth() - opening.getMonth());
  return 60 - monthsElapsed;
};

const HomePage = () => {
  const { user, users } = useContext(DataContext);
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState({ label: 'Loading weather', temp: null });
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=22.5726&longitude=88.3639&current=temperature_2m,weather_code');
        const data = await response.json();
        const temperature = data?.current?.temperature_2m;
        setWeather({
          label: 'Kolkata weather',
          temp: typeof temperature === 'number' ? `${temperature}°C` : 'Unavailable',
        });
      } catch (error) {
        console.error('Weather fetch failed', error);
        setWeather({ label: 'Weather unavailable', temp: '--' });
      }
    };

    fetchWeather();
  }, []);

  const activeUsers = useMemo(() => users.filter((item) => item.isActive !== false), [users]);
  const maturityCandidates = useMemo(() => {
    return activeUsers
      .map((item) => ({ ...item, monthsLeft: monthsUntilMaturity(item.accountOpeningDate) }))
      .filter((item) => item.monthsLeft !== null && item.monthsLeft <= 6)
      .sort((a, b) => a.monthsLeft - b.monthsLeft)
      .slice(0, 20);
  }, [activeUsers]);

  const visibleCandidates = showAll ? maturityCandidates : maturityCandidates.slice(0, 5);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Card sx={{ borderRadius: 7, overflow: 'hidden', background: 'linear-gradient(135deg, rgba(255,248,234,0.98), rgba(238,248,247,0.94))' }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography variant="overline" sx={{ letterSpacing: '0.26em', color: '#0e6d62' }}>Daily Control Panel</Typography>
                <Typography variant="h3" sx={{ mt: 1, mb: 2, color: '#17212b', fontFamily: 'Georgia, serif' }}>
                  Welcome back, {user?.agentName || 'Agent'}
                </Typography>
                <Typography sx={{ color: '#51606f', maxWidth: 680 }}>
                  Track live collections, watch maturity risk, and search all accounts tagged under agent ID {user?.agentId}.
                </Typography>
                <Stack direction="row" spacing={1.2} sx={{ mt: 3, flexWrap: 'wrap', gap: 1.2 }}>
                  <Chip icon={<BadgeRoundedIcon />} label={`Agent: ${user?.agentId || 'N/A'}`} />
                  <Chip icon={<EventAvailableRoundedIcon />} label={format(time, 'dd MMM yyyy, hh:mm:ss a')} />
                  <Chip icon={<WbSunnyIcon />} label={`${weather.label} • ${weather.temp || '--'}`} />
                </Stack>
              </Grid>
              <Grid item xs={12} md={5}>
                <Grid container spacing={2}>
                  {[
                    { label: 'Active Users', value: activeUsers.length, icon: <Groups2RoundedIcon /> },
                    { label: 'Near Maturity', value: maturityCandidates.length, icon: <EventAvailableRoundedIcon /> },
                  ].map((item) => (
                    <Grid item xs={12} sm={6} key={item.label}>
                      <Card sx={{ borderRadius: 5, background: 'rgba(255,255,255,0.82)', boxShadow: 'none' }}>
                        <CardContent>
                          <Avatar sx={{ bgcolor: 'rgba(14,109,98,0.12)', color: '#0e6d62', mb: 1 }}>{item.icon}</Avatar>
                          <Typography variant="body2" sx={{ color: '#637485' }}>{item.label}</Typography>
                          <Typography variant="h4" sx={{ color: '#17212b', fontWeight: 700 }}>{item.value}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card sx={{ borderRadius: 6, background: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontFamily: 'Georgia, serif' }}>Users close to 60-month maturity</Typography>
                    <Typography variant="body2" sx={{ color: '#5a6976' }}>Showing users with 6 months or less left, capped at 20 records.</Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Button variant={!showAll ? 'contained' : 'outlined'} onClick={() => setShowAll(false)}>Show 5</Button>
                    <Button variant={showAll ? 'contained' : 'outlined'} onClick={() => setShowAll(true)}>Show all 20</Button>
                  </Stack>
                </Box>

                <Stack spacing={1.5}>
                  {visibleCandidates.length === 0 ? (
                    <Typography variant="body2" sx={{ color: '#6b7b88' }}>No users are currently within the 6-month maturity window.</Typography>
                  ) : (
                    visibleCandidates.map((account) => (
                      <Box key={account.id} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.3fr 1fr 0.8fr auto' }, gap: 2, alignItems: 'center', p: 2, borderRadius: 4, background: '#f8fafb' }}>
                        <Box>
                          <Typography sx={{ fontWeight: 700 }}>{account.firstName} {account.lastName}</Typography>
                          <Typography variant="body2" sx={{ color: '#647381' }}>A/C {account.accountNumber}</Typography>
                        </Box>
                        <Typography variant="body2">Opened {account.accountOpeningDate?.toDate ? format(account.accountOpeningDate.toDate(), 'dd/MM/yyyy') : 'N/A'}</Typography>
                        <Chip label={`${account.monthsLeft} months left`} sx={{ width: 'fit-content' }} />
                        <Button component={Link} to={`/user-details/${account.id}`} variant="text">Open</Button>
                      </Box>
                    ))
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card sx={{ borderRadius: 6, background: 'white' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontFamily: 'Georgia, serif', mb: 1 }}>Quick actions</Typography>
                <Stack spacing={1.5}>
                  <Button component={Link} to="/daily-schedule" variant="contained" sx={{ justifyContent: 'flex-start' }}>Open daily schedule</Button>
                  <Button component={Link} to="/summary" variant="outlined" sx={{ justifyContent: 'flex-start' }}>See monthly summaries</Button>
                  <Button component={Link} to="/users" variant="outlined" sx={{ justifyContent: 'flex-start' }}>Search accounts</Button>
                  <Button component={Link} to="/create-user" variant="outlined" sx={{ justifyContent: 'flex-start' }}>Create new user</Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
};

export default HomePage;