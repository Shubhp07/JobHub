import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar'; // Adjust path if needed
import Dashboard from './Dashboard'; // The Dashboard.jsx file you provided

export default function EmployerDashboardLayout() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [isAuthReady, setIsAuthReady] = useState(false);

  // This effect runs once on component mount.
  // It simulates checking for a user's login status.
  useEffect(() => {
    // In a real app, you would check for a valid token from your backend here.
    // For this example, we'll just set the mock token.
    localStorage.setItem('token', 'mock-employer-token');
    
    // Once the token is set, we signal that authentication is ready.
    setIsAuthReady(true);
  }, []);

  // **THE FIX**: Do not render the main UI until authentication is ready.
  // This prevents child components from fetching data before the token exists.
  if (!isAuthReady) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <p className="text-gray-600">Initializing Dashboard...</p>
        </div>
    );
  }

  // Once ready, render the full dashboard.
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1">
        {/* Your Dashboard component now receives the activeTab as a prop */}
        <Dashboard activeTab={activeTab} />
      </main>
    </div>
  );
}