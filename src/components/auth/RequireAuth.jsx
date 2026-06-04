// src/components/RequireAuth.jsx

import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const location = useLocation();

  // Your logic to check for an authentication token
  // This is the most common way: checking localStorage.
  const token = localStorage.getItem('token');

  if (!token) {
    // If the user is not authenticated, redirect them to the login page.
    // We save the original location they were trying to go to, so we can
    // redirect them back there after they log in.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user is authenticated, render the child component (the protected page).
  return children;
};

export default RequireAuth;
