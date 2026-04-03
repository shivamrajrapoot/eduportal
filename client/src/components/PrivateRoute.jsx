// client/src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { accessToken, loading } = useAuth();

  // Auth check ho raha hai — wait karo
  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '200px' }}>Loading...</div>;
  }

  // token nahi hai? login pe bhejo
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;