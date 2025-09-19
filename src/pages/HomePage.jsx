import React, { useState, useEffect } from 'react';
import { Typography, Container, Card, CardContent, Box, Grid, Button, Avatar, Divider, Link, Tooltip } from '@mui/material';
import { format } from 'date-fns';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import LoginIcon from '@mui/icons-material/Login';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoIcon from '@mui/icons-material/Info';

const HomePage = () => {
    const [time, setTime] = useState(new Date());
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);

        const fetchWeather = async () => {
            try {
                await new Promise(resolve => setTimeout(() => resolve({ temp: 28, condition: 'Sunny' }), 1000));
                setWeather({ temp: 28, condition: 'Sunny' });
            } catch (error) {
                console.error("Failed to fetch weather:", error);
            }
        };

        fetchWeather();

        return () => clearInterval(timer);
    }, []);

    const cardStyle = {
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 24px 0 rgba(0,0,0,0.1)',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 32px 0 rgba(0,0,0,0.15)',
        },
    };

    const schemeRates = {
        'RD': '6.7%',
        'MIS': '7.4%',
        'Savings Account': '4.0%',
        'NSC': '7.7%',
        'KVP': '7.5%',
    };
    const lastUpdated = 'April 1, 2024';
    const sourceURL = 'https://www.indiapost.gov.in/banking-services/saving';


    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: 4, background: '#f4f6f8' }}>
            <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src="https://static.mygov.in/media/blog/2017/06/pic3.jpg" alt="IPPB Logo" sx={{ width: 50, height: 50, mr: 2 }} />
                        <Typography variant="h5" component="h1" sx={{ color: '#333', fontWeight: 'bold' }}>
                            India Post Payments Bank
                        </Typography>
                    </Box>
                    <Box>
                        <Tooltip title="View account balance and epassbook functionality for POSB accounts">
                            <Button 
                                variant="contained" 
                                href="https://posbseva.indiapost.gov.in/indiapost/signin/" 
                                target="_blank"
                                sx={{ 
                                    background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)', 
                                    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                                    color: 'white',
                                    borderRadius: '12px',
                                    mr: 2
                                }}
                            >
                                <LoginIcon sx={{ mr: 1 }} />
                                Post Office Seva
                            </Button>
                        </Tooltip>
                        <Button 
                            variant="contained" 
                            href="https://dopagent.indiapost.gov.in/corp/AuthenticationController?FORMSGROUP_ID__=AuthenticationFG&__START_TRAN_FLAG__=Y&__FG_BUTTONS__=LOAD&ACTION.LOAD=Y&AuthenticationFG.LOGIN_FLAG=3&BANK_ID=DOP&AGENT_FLAG=Y" 
                            target="_blank"
                            sx={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)', color: 'white', borderRadius: '12px' }}
                        >
                            <LoginIcon sx={{ mr: 1 }} />
                            DOP Agent Login
                        </Button>
                    </Box>
                </Box>

                <Typography variant="h4" sx={{ textAlign: 'center', color: '#555', fontWeight: 'bold', my: 2 }}>
                    Agent Portal
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <Avatar sx={{ width: 60, height: 60, mr: 2, bgcolor: '#1976d2' }}>R</Avatar>
                    <Box>
                        <Typography variant="h5" sx={{ color: '#333', fontWeight: '500' }}>
                            Welcome, Rajesh
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#555' }}>
                            Agent ID: 123456789
                        </Typography>
                    </Box>
                </Box>

                <Grid container spacing={4}>
                     <Grid item xs={12} sm={6} md={3}>
                        <Card sx={cardStyle}>
                            <CardContent sx={{ textAlign: 'center', color: '#333' }}>
                                <AccessTimeFilledIcon sx={{ fontSize: 40, mb: 1, color: '#1976d2' }} />
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{format(time, 'HH:mm:ss')}</Typography>
                                <Typography variant="body1">Live Time</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={cardStyle}>
                            <CardContent sx={{ textAlign: 'center', color: '#333' }}>
                                <CalendarTodayIcon sx={{ fontSize: 40, mb: 1, color: '#1976d2' }} />
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{format(time, 'MMMM do')}</Typography>
                                <Typography variant="body1">{format(time, 'eeee')}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>


                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={cardStyle}>
                            <CardContent sx={{ color: '#333' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <InfoIcon sx={{ fontSize: 24, mr: 1, color: '#f44336' }} />
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Post Office Schemes Rate</Typography>
                                </Box>
                                <Divider sx={{ my: 1 }} />
                                {Object.entries(schemeRates).map(([scheme, rate]) => (
                                    <Box key={scheme} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{scheme}:</Typography>
                                        <Typography variant="body2">{rate}</Typography>
                                    </Box>
                                ))}
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="caption" sx={{ color: '#777', display: 'block', mt: 1 }}>
                                    Effective From: {lastUpdated}
                                </Typography>
                                <Typography variant="caption" sx={{ display: 'block' }}>
                                    <Link href={sourceURL} target="_blank" rel="noopener noreferrer" sx={{ color: '#1976d2', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                                        Source
                                    </Link>
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Box sx={{ py: 2, textAlign: 'center', color: '#777' }}>
                <Typography variant="body2">
                    Developed & Managed By Rajesh Kumar Choudhary 🌳
                </Typography>
            </Box>
        </Box>
    );
};

export default HomePage;
