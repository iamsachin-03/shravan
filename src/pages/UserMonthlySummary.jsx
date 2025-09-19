
import React, { useState, useEffect, useContext } from 'react';
import { TextField, Typography, Container, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { db } from '../firebase';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { DataContext } from '../context/DataContext';

const UserMonthlySummary = () => {
  const [summary, setSummary] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(DataContext);
  const [dateRange, setDateRange] = useState([
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  ]);

  useEffect(() => {
    const fetchSummary = async (startDate, endDate) => {
      setLoading(true);

      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          accountOpeningDate: data.accountOpeningDate ? data.accountOpeningDate.toDate() : null,
        };
      });

      const paymentsQuery = query(
        collection(db, 'dailyPayments'),
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate))
      );
      const paymentsSnapshot = await getDocs(paymentsQuery);
      const payments = paymentsSnapshot.docs.map(doc => doc.data());

      const aggregatedSummary = users.map(user => {
        const customerPayments = payments.filter(p => p.customerId === user.id);
        const totalAmountPaid = customerPayments.reduce((acc, p) => acc + p.amountPaid, 0);
        const denomination = user.denomination || 0;
        const remainingAmount = denomination - totalAmountPaid;

        return {
          ...user,
          totalAmountPaid,
          remainingAmount,
        };
      });

      setSummary(aggregatedSummary);
      setLoading(false);
    };

    if (user && dateRange[0] && dateRange[1]) {
      fetchSummary(dateRange[0], dateRange[1]);
    }
  }, [dateRange, user]);

  const filteredSummary = summary.filter(item => 
    (item.firstName && item.firstName.toLowerCase().includes(searchText.toLowerCase())) ||
    (item.lastName && item.lastName.toLowerCase().includes(searchText.toLowerCase())) ||
    (item.accountNumber && item.accountNumber.toLowerCase().includes(searchText.toLowerCase()))
  );

  const columns = [
    { field: 'accountNumber', headerName: 'Account Number', width: 200 },
    { field: 'firstName', headerName: 'First Name', width: 150 },
    { field: 'lastName', headerName: 'Last Name', width: 150 },
    { field: 'denomination', headerName: 'Denomination', width: 150, type: 'number' },
    { field: 'totalAmountPaid', headerName: 'Total Paid', width: 150, type: 'number' },
    { field: 'remainingAmount', headerName: 'Remaining', width: 150, type: 'number' },
  ];

  const textFieldStyles = {
    InputLabelProps:{ style: { color: '#555' } },
    sx:{
        background: 'rgba(0, 0, 0, 0.05)',
        borderRadius: '8px',
        '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.2)' },
            '&:hover fieldset': { borderColor: 'black' },
            '&.Mui-focused fieldset': { borderColor: 'pink' },
        },
        '& .MuiInputBase-input': { color: 'black' },
        '& .MuiSvgIcon-root': { color: 'black' }
    }
  };

  if (loading || !user) {
    return (
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress sx={{ color: 'white' }} />
        </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Card sx={{ background: 'white', borderRadius: '12px', color: 'black', p: 3, boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold', textTransform: 'uppercase', color: 'black' }}>
            User Monthly Summary
          </Typography>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateRangePicker
                      calendars={1}
                      value={dateRange}
                      onChange={(newValue) => setDateRange(newValue)}
                      sx={{
                        background: 'rgba(0, 0, 0, 0.05)',
                        borderRadius: '8px',
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.2)' },
                            '&:hover fieldset': { borderColor: 'black' },
                            '&.Mui-focused fieldset': { borderColor: 'pink' },
                        },
                        '& .MuiInputBase-input': { color: 'black' },
                        '& .MuiSvgIcon-root': { color: 'black' },
                        '& .MuiInputLabel-root': { color: '#555' },
                        '& .MuiTypography-root': { color: 'black'},
                      }}
                  />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Search by Name or A/C No."
                variant="outlined"
                fullWidth
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                {...textFieldStyles}
              />
            </Grid>
          </Grid>
          <div style={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={filteredSummary}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              sx={{
                color: 'black',
                border: 'none',
                '& .MuiDataGrid-columnHeaders': { color: 'black', fontWeight: 'bold', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' },
                '& .MuiDataGrid-cell': { borderBottom: '1px solid rgba(0, 0, 0, 0.12)'},
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

export default UserMonthlySummary;
