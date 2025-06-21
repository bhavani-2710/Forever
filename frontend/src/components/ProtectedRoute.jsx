// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
// import Loader from './Loader'; // Optional

const ProtectedRoute = ({ children, authenticated, loading }) => {
  if (loading) return null; // or return null if you prefer

  return authenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
