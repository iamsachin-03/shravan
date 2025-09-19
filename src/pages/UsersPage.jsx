import React, { useState, useEffect, useContext } from 'react';
import { TextField, Typography, Container, Card, CardContent, Box, CircularProgress, Grid, Button, Avatar } from '@mui/material';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { DataContext } from '../context/DataContext';
import { format } from 'date-fns';
import { useNavigate, Link } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import PhoneAndroid from '@mui/icons-material/PhoneAndroid';
import Home from '@mui/icons-material/Home';
import Person from '@mui/icons-material/Person';
import Event from '@mui/icons-material/Event';
import MonetizationOn from '@mui/icons-material/MonetizationOn';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useContext(DataContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const usersSnapshot = await getDocs(collection(db, 'users'));
                const usersList = usersSnapshot.docs
                    .filter(doc => doc.data() && doc.data().accountNumber) 
                    .map(doc => {
                        const data = doc.data();
                        return {
                            ...data,
                            id: doc.id,
                            accountOpeningDate: data.accountOpeningDate ? data.accountOpeningDate.toDate() : null,
                        };
                    });
                setUsers(usersList);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchUsers();
        }
    }, [user]);

    const filteredUsers = users.filter(item =>
        (item.firstName && item.firstName.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.lastName && item.lastName.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.accountNumber && item.accountNumber.toLowerCase().includes(searchText.toLowerCase()))
    );

    const iconStyle = { color: '#1976d2', mr: 1 };

    if (loading || !user) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress sx={{ color: 'white' }}/>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Card sx={{ background: 'white', borderRadius: '12px', color: 'black', p: 3, boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )' }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold', textTransform: 'uppercase' }}>
                        Manage Users
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                        <TextField
                            label="Search by Name or Account Number"
                            variant="outlined"
                            fullWidth
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            InputLabelProps={{ style: { color: '#555' } }}
                            sx={{
                                background: 'rgba(0, 0, 0, 0.05)',
                                borderRadius: '8px',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.2)' },
                                    '&:hover fieldset': { borderColor: 'black' },
                                    '&.Mui-focused fieldset': { borderColor: 'black' },
                                },
                                '& .MuiInputBase-input': { color: 'black' },
                            }}
                        />
                    </Box>
                    <Grid container spacing={3} direction="column">
                        {filteredUsers.map((u) => (
                            <Grid item xs={12} key={u.id}>
                                <Card sx={{ 
                                    background: 'linear-gradient(145deg, #f9f9f9, #ffffff)', 
                                    borderRadius: '16px', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    boxShadow: '0 8px 24px 0 rgba(0,0,0,0.12)',
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 12px 32px 0 rgba(0,0,0,0.18)',
                                    }
                                }}>
                                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={2} container justifyContent="center" alignItems="flex-start">
                                                <Avatar sx={{ width: 60, height: 60, bgcolor: '#1976d2', fontSize: '1.5rem' }}>
                                                    {u.firstName && u.firstName.charAt(0)}{u.lastName && u.lastName.charAt(0)}
                                                </Avatar>
                                            </Grid>
                                            <Grid item xs={12} sm={10}>
                                                <Typography variant="h6" component={Link} to={`/user-details/${u.id}`} sx={{ color: 'black', textDecoration: 'none', fontWeight: 'bold', '&:hover': { textDecoration: 'underline' }, display: 'flex', alignItems: 'center'}}>
                                                    <AccountCircle sx={iconStyle} /> A/C: {u.accountNumber}
                                                </Typography>
                                                <Box sx={{ mt: 2, pl: 1 }}>
                                                    <Typography variant="body1" sx={{ color: 'black', display: 'flex', alignItems: 'center', mb: 1 }}><Person sx={iconStyle} /> {u.firstName} {u.lastName}</Typography>
                                                    <Typography variant="body2" sx={{ color: '#555', display: 'flex', alignItems: 'center', mb: 1 }}><Person sx={iconStyle} /> Nominee: {u.nomineeName}</Typography>
                                                    <Typography variant="body2" sx={{ color: '#555', display: 'flex', alignItems: 'center', mb: 1 }}><PhoneAndroid sx={iconStyle} /> Mobile: {u.mobileNumber}</Typography>
                                                    <Typography variant="body2" sx={{ color: '#555', display: 'flex', alignItems: 'center', mb: 1 }}><MonetizationOn sx={iconStyle} /> Denomination: {u.denomination}</Typography>
                                                    <Typography variant="body2" sx={{ color: '#555', display: 'flex', alignItems: 'flex-start', mt: 1, mb: 1 }}><Home sx={iconStyle} /> Address: <Box component="span" sx={{ pl: 0.5, wordBreak: 'break-word' }}>{u.address}</Box></Typography>
                                                    <Typography variant="body2" sx={{ color: '#555', display: 'flex', alignItems: 'center', mt: 1}}><Event sx={iconStyle} />
                                                        Opened: {u.accountOpeningDate ? format(u.accountOpeningDate, 'dd/MM/yyyy') : 'N/A'}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                    <CardContent sx={{ pt: 0, display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => navigate(`/user-details/${u.id}`)}
                                            sx={{ 
                                                background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
                                                color: 'white',
                                                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                                                '&:hover': {
                                                    background: 'linear-gradient(45deg, #21CBF3 30%, #1976d2 90%)',
                                                }
                                            }}
                                        >
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
