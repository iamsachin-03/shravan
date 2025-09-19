import React, { useState, useEffect, useContext } from 'react';
import { Typography, Container, Card, CardContent, Grid, CircularProgress, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, query, where, Timestamp, orderBy, limit } from "firebase/firestore";
import { DataContext } from '../context/DataContext';
import { DataGrid } from '@mui/x-data-grid';

const AdminDashboardPage = () => {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalAmountToday, setTotalAmountToday] = useState(0);
  const [totalAmountLast30Days, setTotalAmountLast30Days] = useState(0);
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(DataContext);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    setLoading(true);

    const usersSnapshot = await getDocs(collection(db, "users"));
    setTotalCustomers(usersSnapshot.size);

    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));
    const paymentsTodayQuery = query(
      collection(db, "dailyPayments"),
      where("date", ">=", Timestamp.fromDate(startOfToday)),
      where("date", "<=", Timestamp.fromDate(endOfToday))
    );
    const paymentsTodaySnapshot = await getDocs(paymentsTodayQuery);
    const totalToday = paymentsTodaySnapshot.docs.reduce((acc, doc) => acc + doc.data().amountPaid, 0);
    setTotalAmountToday(totalToday);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const paymentsLast30DaysQuery = query(
      collection(db, "dailyPayments"),
      where("date", ">=", Timestamp.fromDate(thirtyDaysAgo))
    );
    const paymentsLast30DaysSnapshot = await getDocs(paymentsLast30DaysQuery);
    const totalLast30Days = paymentsLast30DaysSnapshot.docs.reduce((acc, doc) => acc + doc.data().amountPaid, 0);
    setTotalAmountLast30Days(totalLast30Days);

    const recentPaymentsQuery = query(
        collection(db, "dailyPayments"),
        orderBy("date", "desc"),
        limit(10)
    );
    const recentPaymentsSnapshot = await getDocs(recentPaymentsQuery);
    
    const usersData = usersSnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));

    const recentPaymentsData = recentPaymentsSnapshot.docs.map(doc => {
        const payment = doc.data();
        const customer = usersData.find(u => u.id === payment.customerId);
        return {
            ...payment,
            id: doc.id,
            customerName: customer ? `${customer.firstName} ${customer.lastName}` : 'N/A',
            date: payment.date.toDate().toLocaleDateString(),
        }
    });
    setRecentPayments(recentPaymentsData);

    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const columns = [
    { field: 'date', headerName: 'Date', width: 150 },
    { field: 'customerName', headerName: 'Customer Name', width: 250 },
    { field: 'amountPaid', headerName: 'Amount Paid', width: 150, type: 'number' },
  ];

  if (loading || !user) {
    return (
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress sx={{ color: 'white' }}/>
        </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white', textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase' }}>
                Admin Dashboard
            </Typography>
        </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={4}>
            <Card sx={{ background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(10px)', borderRadius: '12px', color: 'white', p: 2, border: '1px solid rgba(255, 255, 255, 0.2)', textAlign: 'center' }}>
                <CardContent>
                    <Typography variant="h6">Total Customers</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{totalCustomers}</Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
            <Card sx={{ background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(10px)', borderRadius: '12px', color: 'white', p: 2, border: '1px solid rgba(255, 255, 255, 0.2)', textAlign: 'center' }}>
                <CardContent>
                    <Typography variant="h6">Total Amount Today</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>₹{totalAmountToday.toLocaleString()}</Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
            <Card sx={{ background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(10px)', borderRadius: '12px', color: 'white', p: 2, border: '1px solid rgba(255, 255, 255, 0.2)', textAlign: 'center' }}>
                <CardContent>
                    <Typography variant="h6">Total (Last 30 Days)</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>₹{totalAmountLast30Days.toLocaleString()}</Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid item xs={12}>
            <Card sx={{ background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(10px)', borderRadius: '12px', color: 'white', p: 2, border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>Recent Payments</Typography>
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={recentPayments}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            sx={{
                                color: 'black',
                                border: 'none',
                                '& .MuiDataGrid-columnHeaders': { color: 'black', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' },
                                '& .MuiDataGrid-cell': { borderBottom: '1px solid rgba(255, 255, 255, 0.2)'},
                                '& .MuiTablePagination-root': { color: 'black' },
                                '& .MuiDataGrid-footerContainer': { borderTop: '1px solid rgba(255, 255, 255, 0.2)', color: 'black' },
                                '& .MuiDataGrid-watermark': { display: 'none' }
                            }}
                        />
                    </div>
                </CardContent>
            </Card>
        </Grid>
        <Grid item xs={12}>
            <Card sx={{ background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(10px)', borderRadius: '12px', color: 'white', p: 2, border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>Quick Links</Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button variant="contained" onClick={() => navigate('/daily-schedule')} sx={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', color: 'white', '&:hover': { background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)' } }}>Daily Schedule</Button>
                        <Button variant="contained" onClick={() => navigate('/summary')} sx={{ background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', color: 'white', '&:hover': { background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)' } }}>User Monthly Summary</Button>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboardPage;
