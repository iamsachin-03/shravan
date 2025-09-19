import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext.jsx';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useContext(DataContext);

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
