// client/src/components/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { accessToken, user } = useAuth();

  // login nahi? login pe bhejo
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // admin nahi? dashboard pe bhejo
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;