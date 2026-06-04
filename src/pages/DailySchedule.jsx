import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, CircularProgress, Container, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { Timestamp, addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { DataContext } from '../context/DataContext';
import { updateMonthlySummaryForUser } from '../utils/monthlySummary';

const DailySchedule = () => {
  const { user, users } = useContext(DataContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [payments, setPayments] = useState({});
  const [notes, setNotes] = useState({});
  const [date, setDate] = useState(new Date());
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const paymentsQuery = query(
        collection(db, 'dailyPayments'),
        where('agentId', '==', user.agentId),
        where('date', '>=', Timestamp.fromDate(startOfDay)),
        where('date', '<=', Timestamp.fromDate(endOfDay))
      );

      const paymentsSnapshot = await getDocs(paymentsQuery);
      const paymentsData = {};
      const notesData = {};

      paymentsSnapshot.forEach((docItem) => {
        const data = docItem.data();
        paymentsData[data.customerId] = {
          amount: data.amountPaid,
          docId: docItem.id,
        };
        notesData[data.customerId] = data.note || '';
      });

      setPayments(paymentsData);
      setNotes(notesData);
      setLoading(false);
    };

    if (user?.agentId) {
      fetchPayments();
    }
  }, [date, user]);

  const handlePaymentChange = (customerId, amount) => {
    setPayments((current) => ({
      ...current,
      [customerId]: {
        ...current[customerId],
        amount,
      },
    }));
  };

  const handleNoteChange = (customerId, note) => {
    setNotes((current) => ({ ...current, [customerId]: note }));
  };

  const showMessage = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  const handleSavePayment = async (customer) => {
    const currentPayment = payments[customer.id];
    const parsedAmount = Number(currentPayment?.amount || 0);

    if (!parsedAmount || parsedAmount < 0) {
      showMessage('Enter a valid amount before saving.', 'error');
      return;
    }

    const payload = {
      customerId: customer.id,
      accountNumber: customer.accountNumber,
      customerName: `${customer.firstName} ${customer.lastName || ''}`.trim(),
      amountPaid: parsedAmount,
      date: Timestamp.fromDate(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0)),
      agentId: user.agentId,
      note: notes[customer.id] || '',
      updatedAt: Timestamp.now(),
    };

    try {
      if (currentPayment?.docId) {
        await updateDoc(doc(db, 'dailyPayments', currentPayment.docId), payload);
      } else {
        const newDoc = await addDoc(collection(db, 'dailyPayments'), {
          ...payload,
          createdAt: Timestamp.now(),
        });
        setPayments((current) => ({
          ...current,
          [customer.id]: { amount: parsedAmount, docId: newDoc.id },
        }));
      }

      const { totalAmountReceived, monthPaidUpTo } = await updateMonthlySummaryForUser({
        customer,
        entryDate: date,
        latestAmount: parsedAmount,
      });

      await updateDoc(doc(db, 'users', customer.id), {
        totalDepositedAmountSoFar: totalAmountReceived,
        monthPaidUpTo,
        dateOfLastDeposit: Timestamp.fromDate(date),
        updatedAt: Timestamp.now(),
      });

      showMessage(`Saved ${parsedAmount} for ${customer.firstName}. Monthly summary updated.`);
    } catch (error) {
      console.error('Error saving payment:', error);
      showMessage(error.message || 'Failed to save payment', 'error');
    }
  };

  const filteredCustomers = useMemo(() => {
    return users.filter((customer) => {
      const text = searchQuery.toLowerCase();
      return (
        `${customer.firstName || ''} ${customer.lastName || ''}`.toLowerCase().includes(text) ||
        String(customer.accountNumber || '').toLowerCase().includes(text) ||
        String(customer.nomineeName || '').toLowerCase().includes(text)
      );
    });
  }, [searchQuery, users]);

  const totalCollected = Object.values(payments).reduce((sum, entry) => sum + Number(entry?.amount || 0), 0);

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1.2,
      renderCell: (params) => (
        <Box>
          <Typography component={Link} to={`/user-details/${params.row.id}`} sx={{ textDecoration: 'none', color: '#0e6d62', fontWeight: 700 }}>
            {params.row.firstName} {params.row.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">{params.row.accountNumber}</Typography>
        </Box>
      ),
    },
    {
      field: 'amountPaid',
      headerName: 'Amount',
      flex: 0.9,
      renderCell: (params) => (
        <TextField type="number" size="small" value={payments[params.row.id]?.amount || ''} onChange={(event) => handlePaymentChange(params.row.id, event.target.value)} fullWidth />
      ),
    },
    {
      field: 'note',
      headerName: 'Note',
      flex: 1.2,
      renderCell: (params) => (
        <TextField size="small" value={notes[params.row.id] || ''} onChange={(event) => handleNoteChange(params.row.id, event.target.value)} fullWidth placeholder="Optional note" />
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0.7,
      sortable: false,
      renderCell: (params) => (
        <Button variant="contained" onClick={() => handleSavePayment(params.row)} fullWidth>
          Save
        </Button>
      ),
    },
  ];

  if (loading || !user) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((current) => ({ ...current, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>

      <Card sx={{ borderRadius: 6 }}>
        <CardContent>
          <Stack spacing={2.5}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="h4" sx={{ fontFamily: 'Georgia, serif' }}>Daily Collection Schedule</Typography>
                <Typography variant="body2" color="text.secondary">Save amount against each account. Each save also updates the calendar-month summary for that user.</Typography>
              </Box>
              <Typography variant="h6">Total collected today: {totalCollected}</Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker label="Collection Date" value={date} onChange={(newValue) => setDate(newValue || new Date())} renderInput={(params) => <TextField {...params} />} />
              </LocalizationProvider>
              <TextField label="Search by name, account, nominee" variant="outlined" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} sx={{ minWidth: 320 }} />
            </Box>

            <Box sx={{ height: 'calc(100vh - 280px)', width: '100%' }}>
              <DataGrid
                rows={filteredCustomers}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                disableRowSelectionOnClick
                getRowHeight={() => 84}
                sx={{ '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' } }}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default DailySchedule;