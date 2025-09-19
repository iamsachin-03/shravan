import React from 'react';
import { TextField, Typography, Button, Grid, Box } from '@mui/material';

export const ALL_DENOMINATIONS = [2000, 500, 200, 100, 50, 20, 10, 5, 2, 1];

const DenominationCalculator = ({ denominations, onDenominationChange, onClear }) => {

  const total = ALL_DENOMINATIONS.reduce((acc, key) => acc + (key * (denominations[key] || 0)), 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onDenominationChange(name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (value === '') {
        onDenominationChange(name, '0');
    }
  };

  return (
    <Box sx={{ p: 2, borderRadius: '15px' }}>
      <Grid container spacing={2}>
        {ALL_DENOMINATIONS.map((key) => (
          <Grid item xs={6} key={key}>
            <TextField
              label={`₹${key}`}
              type="number"
              name={String(key)}
              value={denominations[key] == null || denominations[key] === 0 ? '0' : String(denominations[key])}
              onChange={handleChange}
              onBlur={handleBlur}
              fullWidth
              inputProps={{ min: 0 }}
              sx={{
                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                  display: 'none',
                },
                '& input[type=number]': {
                  'MozAppearance': 'textfield',
                },
              }}
            />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 2, p: 2, borderRadius: '10px', color: 'white', background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }}>
        <Typography variant="h6" align="center">Total: ₹{total}</Typography>
      </Box>
      <Button onClick={onClear} variant="contained" color="secondary" fullWidth sx={{ mt: 2 }}>
        Clear
      </Button>
    </Box>
  );
};

export default DenominationCalculator;
