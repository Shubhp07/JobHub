import React, { useState, useEffect } from 'react';

// Import the components this layout uses
import Sidebar from '../components/Employer-Dashboard/Sidebar'; // Adjust path if needed
import PostedJobs from '../components/Employer-Dashboard/PostedJobs'; // Adjust path if needed

// A placeholder for other dashboard sections
const Placeholder = ({ title }) => (
    <div className="p-8 flex-1">
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600">This section is under construction.</p>
        </div>
    </div>
);

// This component decides which view to show based on the active tab
const DashboardContent = ({ activeTab }) => {
    switch (activeTab) {
        case 'jobs':
            return <PostedJobs />;
        case 'dashboard':
            return <Placeholder title="Dashboard Overview" />;
        case 'applications':
            return <Placeholder title="Manage Applications" />;
        // Add other cases for your sidebar items here
        default:
            return <Placeholder title="Coming Soon" />;
    }
};

const EmployerDashboard = () => {
    const [activeTab, setActiveTab] = useState('jobs');
    const [isAuthReady, setIsAuthReady] = useState(false);

    // This effect ensures we don't render the dashboard until we've
    // confirmed the user is "logged in" (i.e., token exists).
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthReady(true);
        } else {
            // This case should ideally be handled by your RequireAuth component,
            // which would redirect to the login page.
            console.error("Authentication check failed. Redirecting to login is recommended.");
        }
    }, []);

    // Show a loading state while we check for the token
    if (!isAuthReady) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <p className="text-gray-600">Initializing Dashboard...</p>
            </div>
        );
    }

    // Render the full dashboard layout
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1">
                <DashboardContent activeTab={activeTab} />
            </main>
        </div>
    );
};

export default EmployerDashboard;
