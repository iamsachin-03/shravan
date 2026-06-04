import React, { useContext, useMemo, useState } from 'react';
import { TextField, Typography, Container, Card, CardContent, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { DataContext } from '../context/DataContext';

const UserMonthlySummary = () => {
  const { user, userMonthlySummary, loading } = useContext(DataContext);
  const [searchText, setSearchText] = useState('');

  const filteredSummary = useMemo(() => {
    return userMonthlySummary.filter((item) => {
      const text = searchText.toLowerCase();
      return (
        String(item.firstName || '').toLowerCase().includes(text) ||
        String(item.lastName || '').toLowerCase().includes(text) ||
        String(item.accountNumber || '').toLowerCase().includes(text)
      );
    });
  }, [searchText, userMonthlySummary]);

  const columns = [
    { field: 'accountNumber', headerName: 'Account Number', width: 180 },
    { field: 'firstName', headerName: 'First Name', width: 140 },
    { field: 'lastName', headerName: 'Last Name', width: 140 },
    { field: 'year', headerName: 'Year', width: 90 },
    { field: 'month', headerName: 'Month', width: 90 },
    { field: 'denomination', headerName: 'Denomination', width: 140, type: 'number' },
    { field: 'amountReceived', headerName: 'Latest Amount', width: 140, type: 'number' },
    { field: 'totalAmountReceived', headerName: 'Total Received', width: 150, type: 'number' },
    { field: 'remainingAmount', headerName: 'Remaining', width: 140, type: 'number' },
  ];

  if (loading || !user) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Card sx={{ background: 'white', borderRadius: '12px', color: 'black', p: 3, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold', textTransform: 'uppercase', color: 'black' }}>
            User Monthly Summary
          </Typography>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <TextField
                label="Search by Name or A/C No."
                variant="outlined"
                fullWidth
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                InputLabelProps={{ style: { color: '#555' } }}
                sx={{
                  background: 'rgba(0, 0, 0, 0.05)',
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.2)' },
                    '&:hover fieldset': { borderColor: 'black' },
                    '&.Mui-focused fieldset': { borderColor: 'pink' },
                  },
                  '& .MuiInputBase-input': { color: 'black' },
                }}
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
                '& .MuiDataGrid-cell': { borderBottom: '1px solid rgba(0, 0, 0, 0.12)' },
                '& .MuiTablePagination-root': { color: 'black' },
                '& .MuiDataGrid-footerContainer': { borderTop: '1px solid rgba(0, 0, 0, 0.12)', color: 'black' },
                '& .MuiDataGrid-watermark': { display: 'none' },
              }}
            />
          </div>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserMonthlySummary;