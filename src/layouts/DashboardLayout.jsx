import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardHeader from "../components/shared/DashboardHeader";
import EmployerDashboard from "../components/dashboard/EmployerDashboard";
import JobSeekerDashboard from "../components/dashboard/DashboardOverview";
import Sidebar from "../components/dashboard/Sidebar";
import JobForm from "../components/dashboard/JobForm";

import Profile from '../components/dashboard/Profile';
import Applications from '../components/dashboard/Applications';
import Messages from '../components/dashboard/Messages';
import Settings from '../components/dashboard/Settings';
import JobsPage from "../components/dashboard/JobsPage";
import { useJobContext } from '../context/JobContext';

const DashboardLayout = () => {
  const { postJob } = useJobContext();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isEmployer = location.pathname.includes("/dashboard/employer");

  const handlePostJob = () => setIsJobFormOpen(true);

  const handleJobSubmit = (jobData) => {
    postJob(jobData)
    console.log("New job submitted:", jobData);
    setIsJobFormOpen(false);
    ; // save job to global state
  };

  const renderDashboard = () => {
    if (isEmployer) {
      return <EmployerDashboard activeTab={activeTab} />;
    }

    switch (activeTab) {
      case "dashboard":
        return <JobSeekerDashboard />;
      case "profile":
        return <Profile />;
      case "jobs":
        return<JobsPage/>
      case "applications":
        return <Applications />;
      case "messages":
        return <Messages />;
      case "settings":
        return <Settings />;
      default:
        return <JobSeekerDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        isEmployer={isEmployer}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onPostJob={handlePostJob}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4">
          {renderDashboard()}
        </main>
      </div>
      {isEmployer && (
        <JobForm
          isOpen={isJobFormOpen}
          onClose={() => setIsJobFormOpen(false)}
          onSubmit={handleJobSubmit}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
