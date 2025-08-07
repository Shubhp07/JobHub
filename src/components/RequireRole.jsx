// src/components/RequireRole.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import RequireAuth from './RequireAuth';

const RequireRole = ({ allowedRoles, children }) => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const userRole = (user?.userType || '').trim().toUpperCase();

  // ✅ THE FIX: The `allowedRoles` array passed from App.jsx will now match correctly.
  if (allowedRoles?.includes(userRole)) {
    return children;
  }

  return (
    <RequireAuth>
      <Navigate to="/" replace />
    </RequireAuth>
  );
};

export default RequireRole;
