import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Typography, Container, Card, CardContent, Box, Snackbar, Alert, CircularProgress } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DataGrid } from '@mui/x-data-grid';
import { db } from '../firebase';
import { collection, getDocs, addDoc, query, where, Timestamp, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { DataContext } from '../context/DataContext';

const DailySchedule = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [payments, setPayments] = useState({});
  const [date, setDate] = useState(new Date());
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  const { user } = useContext(DataContext);

  useEffect(() => {
    const fetchCustomersAndPayments = async () => {
      setLoading(true);

      const usersSnapshot = await getDocs(collection(db, 'users'));
      const validUsersList = usersSnapshot.docs
          .map(doc => ({ ...doc.data(), id: doc.id }))
          .filter(user => user.accountNumber && user.firstName);

      const orderDocRef = doc(db, 'userOrder', 'dailySchedule');
      const orderDocSnap = await getDoc(orderDocRef);

      let finalList = validUsersList;

      if (orderDocSnap.exists()) {
          const savedOrder = orderDocSnap.data().order;
          const userMap = new Map(validUsersList.map(user => [user.id, user]));
          const orderedUsers = [];

          savedOrder.forEach(userId => {
              if (userMap.has(userId)) {
                  orderedUsers.push(userMap.get(userId));
                  userMap.delete(userId); 
              }
          });

          finalList = [...orderedUsers, ...userMap.values()];
      } 

      setCustomers(finalList);

      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const paymentsQuery = query(
        collection(db, 'dailyPayments'),
        where('date', '>=', Timestamp.fromDate(startOfDay)),
        where('date', '<=', Timestamp.fromDate(endOfDay))
      );

      const paymentsSnapshot = await getDocs(paymentsQuery);
      const paymentsData = {};
      paymentsSnapshot.forEach(doc => {
        const data = doc.data();
        paymentsData[data.customerId] = {
            amount: data.amountPaid,
            docId: doc.id,
        };
      });
      setPayments(paymentsData);

      setLoading(false);
    };

    if (user) {
        fetchCustomersAndPayments();
    }
  }, [date, user]);

  const handlePaymentChange = (customerId, amount) => {
    setPayments(prev => ({
        ...prev,
        [customerId]: {
            ...prev[customerId],
            amount: amount,
        }
    }));
  };

  const handleSavePayment = async (customerId, amount) => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
        setSnackbar({ open: true, message: 'Please enter a valid positive amount.', severity: 'error' });
        return;
    }

    const existingPayment = payments[customerId];

    try {
      if (existingPayment && existingPayment.docId) {
        const paymentDocRef = doc(db, 'dailyPayments', existingPayment.docId);
        await updateDoc(paymentDocRef, {
          amountPaid: parsedAmount
        });
        setSnackbar({ open: true, message: `Payment updated to ${parsedAmount}.`, severity: 'success' });
      } else {
        const newPaymentRef = await addDoc(collection(db, 'dailyPayments'), {
          customerId,
          amountPaid: parsedAmount,
          date: Timestamp.fromDate(new Date(date.setHours(12,0,0,0))),
          agentId: user.id,
        });
        setPayments(prev => ({
            ...prev,
            [customerId]: {
                amount: parsedAmount,
                docId: newPaymentRef.id,
            }
        }));
        setSnackbar({ open: true, message: `Payment of ${parsedAmount} saved.`, severity: 'success' });
      }
    } catch (error) {
      console.error("Error saving payment: ", error);
      setSnackbar({ open: true, message: `Error saving payment: ${error.message}`, severity: 'error' });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };
  
  const filteredCustomers = customers.filter(customer =>
    customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (customer.lastName && customer.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    customer.accountNumber.toString().includes(searchQuery)
  );

  const columns = [
    {
        field: 'serialNumber',
        headerName: '#',
        width: 50,
        sortable: false,
        renderCell: (params) => (
            <Typography variant="subtitle1">{params.value}</Typography>
        )
    },
    {
        field: 'name',
        headerName: 'Name',
        flex: 1,
        renderCell: (params) => (
            <div>
                <Typography variant="subtitle1" noWrap>{params.row.firstName} {params.row.lastName}</Typography>
                <Typography variant="body2" color="text.secondary">{params.row.accountNumber}</Typography>
            </div>
        )
    },
    {
        field: 'amountPaid',
        headerName: 'Amount Paid',
        flex: 1,
        renderCell: (params) => (
            <TextField
                placeholder="Enter amount"
                type="number"
                value={payments[params.row.id]?.amount || ''}
                onChange={(e) => handlePaymentChange(params.row.id, e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                        display: 'none',
                    },
                    '& input[type=number]': {
                        '-moz-appearance': 'textfield',
                    },
                }}
            />
        )
    },
    {
        field: 'action',
        headerName: 'Action',
        flex: 1,
        renderCell: (params) => (
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleSavePayment(params.row.id, payments[params.row.id]?.amount)}
                fullWidth
            >
                Save
            </Button>
        )
    }
  ];

  const rows = filteredCustomers.map((customer, index) => ({
      ...customer,
      serialNumber: index + 1,
  }));

  if (loading || !user) {
    return (
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Daily Collection Schedule
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Collection Date"
                value={date}
                onChange={(newValue) => setDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <TextField
              label="Search by Name or A/C No."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ width: '50%' }}
            />
          </Box>

          <div style={{ height: 'calc(100vh - 300px)', width: '100%' }}>
              <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10, 25, 50]}
                  disableSelectionOnClick
                  getRowHeight={() => 'auto'}
                  sx={{ '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' } }}
              />
          </div>

        </CardContent>
      </Card>
    </Container>
  );
};

export default DailySchedule;
