import React, { useState, useContext } from 'react';
import { TextField, Button, Typography, Container, Card, CardContent, Box, Grid, MenuItem, Snackbar, Alert } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { DataContext } from '../context/DataContext';

const CreateUserPage = () => {
    const { user } = useContext(DataContext);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        nomineeName: '',
        accountNumber: '',
        address: '',
        mobileNumber: '',
        denomination: '',
        accountType: 'RD',
    });
    const [accountOpeningDate, setAccountOpeningDate] = useState(new Date());
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setSnackbar({ open: true, message: 'You must be logged in to create a user.', severity: 'error' });
            return;
        }

        if (parseInt(formData.denomination) % 1000 !== 0) {
            setSnackbar({ open: true, message: 'Denomination must be in multiples of 1000.', severity: 'error' });
            return;
        }

        try {
            await addDoc(collection(db, 'users'), {
                ...formData,
                denomination: parseInt(formData.denomination),
                mobileNumber: parseInt(formData.mobileNumber),
                accountOpeningDate: Timestamp.fromDate(accountOpeningDate),
                totalDepositedAmountSoFar: 0,
                monthPaidUpTo: 0,
                dateOfLastDeposit: null,
                agentId: user.id, 
            });

            setSnackbar({ open: true, message: 'User created successfully!', severity: 'success' });
            setFormData({
                firstName: '',
                lastName: '',
                nomineeName: '',
                accountNumber: '',
                address: '',
                mobileNumber: '',
                denomination: '',
                accountType: 'RD',
            });
            setAccountOpeningDate(new Date());
        } catch (error) {
            console.error("Error creating user: ", error);
            setSnackbar({ open: true, message: `Error creating user: ${error.message}`, severity: 'error' });
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const textFieldStyles = {
        InputLabelProps:{
            style: { color: '#555' },
        },
        sx:{
            background: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.2)' },
                '&:hover fieldset': { borderColor: 'black' },
                '&.Mui-focused fieldset': { borderColor: 'black' },
            },
            '& .MuiInputBase-input': { color: 'black' },
            '& .MuiSvgIcon-root': { color: 'black' }
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
            <Card sx={{
                background: 'white', 
                borderRadius: '12px', 
                color: 'black',
                p: 3,
                boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )'
            }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ color: 'black', textAlign: 'center', mb: 3, fontWeight: 'bold', textTransform: 'uppercase' }}>
                        Create New User
                    </Typography>
                    <Box component="form" onSubmit={handleFormSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField name="firstName" label="First Name" value={formData.firstName} onChange={handleChange} fullWidth required {...textFieldStyles} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} fullWidth required {...textFieldStyles} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="accountNumber" label="Account Number" value={formData.accountNumber} onChange={handleChange} fullWidth required {...textFieldStyles} />
                            </Grid>
                             <Grid item xs={12} sm={6}>
                                <TextField name="mobileNumber" label="Mobile Number" type="number" value={formData.mobileNumber} onChange={handleChange} fullWidth required {...textFieldStyles} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField name="address" label="Address" value={formData.address} onChange={handleChange} fullWidth multiline rows={3} required {...textFieldStyles} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="nomineeName" label="Nominee Name" value={formData.nomineeName} onChange={handleChange} fullWidth required {...textFieldStyles} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Account Opening Date"
                                        value={accountOpeningDate}
                                        onChange={(newValue) => setAccountOpeningDate(newValue)}
                                        renderInput={(params) => <TextField {...params} fullWidth {...textFieldStyles} />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="denomination" label="Denomination (in multiples of 1000)" type="number" value={formData.denomination} onChange={handleChange} fullWidth required {...textFieldStyles} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField name="accountType" label="Account Type" value={formData.accountType} fullWidth disabled {...textFieldStyles} />
                            </Grid>
                            <Grid item xs={15}>
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    size="large" 
                                    fullWidth
                                    sx={{ 
                                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                        color: 'white',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
                                        }
                                    }}
                                >
                                    Create User
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default CreateUserPage;
