// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { JobProvider } from './context/JobContext';

// --- Import Pages and Layouts ---
import LandingPage from './pages/LandingPage.jsx';
import SignIn from './pages/SignIn.jsx'; // Make sure this component exists
import Login from './pages/Login.jsx';
import OAuthSuccess from './pages/OAuthSuccess.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';

// --- Import the Guard Components ---
import RequireAuth from './components/RequireAuth';
import RequireRole from './components/RequireRole';

const App = () => {
  return (
    <JobProvider>
      <Router>
        <div className="min-h-screen bg-white font-sans">
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            
            {/* ✅ THE FIX: Added the missing route for /signin */}
            <Route path="/signin" element={<SignIn />} /> 
            
            <Route path="/login/oauth-success" element={<OAuthSuccess />} />
            
            {/* --- Protected Routes (Role-Based) --- */}
            <Route
              path="/dashboard/employer/*"
              element={
                <RequireRole allowedRoles={['EMPLOYER']}>
                  <DashboardLayout />
                </RequireRole>
              }
            />
            <Route
              path="/dashboard/jobseeker/*"
              element={
                <RequireRole allowedRoles={['JOBSEEKER']}>
                  <DashboardLayout />
                </RequireRole>
              }
            />
          </Routes>
          <ToastContainer position="bottom-right" />
        </div>
      </Router>
    </JobProvider>
  );
};

export default App;
