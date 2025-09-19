import React, { useContext } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Box, Card, CardContent } from '@mui/material';
import { DataContext } from '../context/DataContext';
import { History } from '@mui/icons-material';

const PaymentHistory = ({ onEdit, paymentHistory }) => {
  const { user } = useContext(DataContext);

  return (
    <Card sx={{ borderRadius: '15px' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <History sx={{ verticalAlign: 'middle', mr: 1 }} /> Payment History
        </Typography>
        {paymentHistory.length === 0 ? (
          <Typography align="center" sx={{ mt: 4 }}>No history found.</Typography>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  {(user && (user.role === 'agent' || user.role === 'staff')) && <TableCell align="right">Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentHistory.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.received_date}
                    </TableCell>
                    <TableCell align="right">{row.amount_received}</TableCell>
                    {(user && (user.role === 'agent' || user.role === 'staff')) && (
                      <TableCell align="right">
                        <Button onClick={() => onEdit(row)}>Edit</Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;
