import React, { useState, useEffect, useContext } from 'react';
import { TextField, Typography, Container, Card, CardContent, Box, CircularProgress, Button, Grid, Snackbar, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { DataContext } from '../context/DataContext';
import { format } from 'date-fns';
import { DataGrid } from '@mui/x-data-grid';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const UserPaymentDetails = () => {
    const { userId } = useParams();
    const [userDetails, setUserDetails] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [accountOpeningDate, setAccountOpeningDate] = useState(new Date());
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const { user } = useContext(DataContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetailsAndPayments = async () => {
            setLoading(true);
            try {
                const userDocRef = doc(db, 'users', userId);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const userData = {
                        ...userDocSnap.data(),
                        id: userDocSnap.id,
                        accountOpeningDate: userDocSnap.data().accountOpeningDate?.toDate(),
                    };
                    setUserDetails(userData);
                    setFormData(userData);
                    setAccountOpeningDate(userData.accountOpeningDate || new Date());
                } else {
                    navigate('/users');
                }

                const paymentsQuery = query(
                    collection(db, 'dailyPayments'),
                    where('customerId', '==', userId)
                );
                const paymentsSnapshot = await getDocs(paymentsQuery);
                const paymentsList = paymentsSnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                    date: doc.data().date.toDate(),
                }));
                setPayments(paymentsList);

            } catch (error) {
                console.error("Failed to fetch user details or payments:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user && userId) {
            fetchUserDetailsAndPayments();
        }
    }, [user, userId, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = async () => {
        try {
            const userDocRef = doc(db, 'users', userId);
            await updateDoc(userDocRef, {
                ...formData,
                accountOpeningDate: Timestamp.fromDate(accountOpeningDate),
            });
            setUserDetails({ ...formData, accountOpeningDate });
            setIsEditing(false);
            setSnackbar({ open: true, message: 'User details updated successfully!', severity: 'success' });
        } catch (error) {
            console.error("Error updating user details:", error);
            setSnackbar({ open: true, message: `Error updating details: ${error.message}`, severity: 'error' });
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const paymentColumns = [
        { field: 'date', headerName: 'Date', width: 150, renderCell: (params) => format(params.value, 'dd/MM/yyyy') },
        { field: 'amountPaid', headerName: 'Amount Paid', width: 150, type: 'number' },
    ];
    
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

    if (loading || !user) {
        return <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress sx={{ color: 'white' }} /></Container>;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">{snackbar.message}</Alert>
            </Snackbar>

            <Card sx={{ background: 'white', borderRadius: '12px', color: 'black', p: 3, boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )' }}>
                <CardContent>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                            User Details
                        </Typography>
                        <Button variant="contained" onClick={() => setIsEditing(!isEditing)} sx={{ mb: 2, background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', color: 'white', '&:hover': { background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)' } }}>
                            {isEditing ? 'Cancel' : 'Edit Details'}
                        </Button>
                    </Grid>
                    
                    {isEditing ? (
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12} sm={6}><TextField label="First Name" name="firstName" value={formData.firstName || ''} onChange={handleInputChange} fullWidth {...textFieldStyles} /></Grid>
                            <Grid item xs={12} sm={6}><TextField label="Last Name" name="lastName" value={formData.lastName || ''} onChange={handleInputChange} fullWidth {...textFieldStyles} /></Grid>
                            <Grid item xs={12} sm={6}><TextField label="Account Number" name="accountNumber" value={formData.accountNumber || ''} onChange={handleInputChange} fullWidth {...textFieldStyles} /></Grid>
                            <Grid item xs={12} sm={6}><TextField label="Mobile Number" name="mobileNumber" value={formData.mobileNumber || ''} onChange={handleInputChange} fullWidth {...textFieldStyles} /></Grid>
                            <Grid item xs={12}><TextField label="Address" name="address" value={formData.address || ''} onChange={handleInputChange} fullWidth multiline rows={3} {...textFieldStyles} /></Grid>
                            <Grid item xs={12} sm={6}><TextField label="Nominee Name" name="nomineeName" value={formData.nomineeName || ''} onChange={handleInputChange} fullWidth {...textFieldStyles} /></Grid>
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
                            <Grid item xs={12} sm={6}><TextField label="Denomination" name="denomination" type="number" value={formData.denomination || ''} onChange={handleInputChange} fullWidth {...textFieldStyles} /></Grid>
                            <Grid item xs={12} sm={6}><TextField label="Account Type" name="accountType" value={formData.accountType || ''} fullWidth disabled {...textFieldStyles} /></Grid>
                            <Grid item xs={12}><Button variant="contained" color="primary" onClick={handleSaveChanges} sx={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', color: 'white', '&:hover': { background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)' } }}>Save Changes</Button></Grid>
                        </Grid>
                    ) : (
                        <Box sx={{ mb: 4, color: 'black' }}>
                            <Typography >A/C Number: {userDetails?.accountNumber}</Typography>
                            <Typography>Name: {userDetails?.firstName} {userDetails?.lastName}</Typography>
                            <Typography>Nominee: {userDetails?.nomineeName}</Typography>
                            <Typography>Mobile: {userDetails?.mobileNumber}</Typography>
                            <Typography>Denomination: {userDetails?.denomination}</Typography>
                            <Typography>Address: {userDetails?.address}</Typography>
                            <Typography>Account Opened: {userDetails?.accountOpeningDate ? format(userDetails.accountOpeningDate, 'dd/MM/yyyy') : 'N/A'}</Typography>
                        </Box>
                    )}

                    <Typography variant="h5" gutterBottom sx={{ mt: 4, fontWeight: 'bold', color: 'black' }}>Payment History</Typography>
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={payments}
                            columns={paymentColumns}
                            pageSize={5}
                            rowsPerPageOptions={[5, 10, 20]}
                            sx={{ 
                                color: 'black', 
                                background: 'white', 
                                borderRadius: '8px', 
                                border: 'none', 
                                '& .MuiDataGrid-columnHeaders': { color: 'black', fontWeight: 'bold', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }, 
                                '& .MuiDataGrid-cell': { borderBottom: '1px solid rgba(0, 0, 0, 0.12)' },
                                '& .MuiTablePagination-root': { color: 'black' },
                                '& .MuiDataGrid-footerContainer': { borderTop: '1px solid rgba(0, 0, 0, 0.12)', color: 'black' },
                                '& .MuiDataGrid-watermark': { display: 'none' }
                            }}
                        />
                    </div>
                </CardContent>
            </Card>
        </Container>
    );
};

export default UserPaymentDetails;
