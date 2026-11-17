// src/components/RequireRole.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireRole = ({ allowedRoles, children }) => {
  const userString = localStorage.getItem('user');

  // ✅ FIX #2: Short-circuit to /login if not authenticated at all
  if (!userString) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userString);
  const userRole = (user?.userType || '').trim().toUpperCase();

  if (allowedRoles?.includes(userRole)) {
    return children;
  }

  // Authenticated but wrong role → go home
  return <Navigate to="/" replace />;
};

export default RequireRole;
