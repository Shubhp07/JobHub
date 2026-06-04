import React, { useState } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import JobSearch from '../components/dashboard/JobSearch';
import Applications from '../components/dashboard/Applications';
import Profile from '../components/dashboard/Profile';
import SavedJobs from '../components/dashboard/SavedJobs';
import Messages from '../components/dashboard/Messages';
import Settings from '../components/dashboard/Settings';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'search':
        return <JobSearch />;
      case 'applications':
        return <Applications />;
      case 'saved':
        return <SavedJobs />;
      case 'profile':
        return <Profile />;
      case 'messages':
        return <Messages />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      
      <div className="flex">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`fixed lg:static inset-y-0 left-0 z-50 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>
        
        {/* Main content */}
        <main className="flex-1 lg:ml-64 min-h-screen">
          <div className=" lg:p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;