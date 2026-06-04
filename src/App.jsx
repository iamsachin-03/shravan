import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { DataProvider, DataContext } from './context/DataContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DailySchedule from './pages/DailySchedule';
import UserMonthlySummary from './pages/UserMonthlySummary';
import CreateUserPage from './pages/CreateUserPage';
import UsersPage from './pages/UsersPage';
import UserPaymentDetails from './pages/UserPaymentDetails';
import HomePage from './pages/HomePage';

const App = () => {
  return (
    <DataProvider>
      <Router>
        <Main />
      </Router>
    </DataProvider>
  );
};

const Main = () => {
  const { user, loading } = React.useContext(DataContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top right, rgba(242,165,65,0.2), transparent 25%), linear-gradient(135deg, #0f1720 0%, #173042 52%, #24485f 100%)',
      }}
    >
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/home" />} />
        <Route path="/forgot-password" element={!user ? <ForgotPasswordPage /> : <Navigate to="/home" />} />
        <Route path="/home" element={user ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/daily-schedule" element={user ? <DailySchedule /> : <Navigate to="/login" />} />
        <Route path="/summary" element={user ? <UserMonthlySummary /> : <Navigate to="/login" />} />
        <Route path="/create-user" element={user ? <CreateUserPage /> : <Navigate to="/login" />} />
        <Route path="/users" element={user ? <UsersPage /> : <Navigate to="/login" />} />
        <Route path="/user-details/:userId" element={user ? <UserPaymentDetails /> : <Navigate to="/login" />} />
        <Route path="/signup" element={<Navigate to="/login" />} />
        <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={user ? '/home' : '/login'} />} />
      </Routes>
    </Box>
  );
};

export default App;