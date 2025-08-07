import React, { useState, useEffect } from "react";
import StatsCard from "./StatsCard";
import JobCard from "./JobCard";
import ApplicationCard from "./ApplicationCard";
import RecentActivity from "./RecentActivity";
import JobForm from "./JobForm";
// CORRECT: This is a default import
import PostedJobs from "../Employer-Dashboard/PostedJobs"; 


import {
  Briefcase,
  Users,
  Calendar,
  TrendingUp,
  Plus,
  Filter,
} from "lucide-react";

import { getAllJobs, createJob } from "../../api/jobs";

const Dashboard = ({ activeTab }) => {
  const [jobs, setJobs] = useState([]);
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchJobsForPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchJobsForPage(currentPage);
    }
  }, [currentPage, activeTab]);

  const fetchJobsForPage = async (page) => {
    try {
      const result = await getAllJobs(page, 5);
      setJobs(result.content);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error(`Failed to load jobs for page ${page}:`, error.message);
    }
  };

  // Mock data
  const stats = [
    {
      title: "Active Jobs",
      value: jobs.filter((job) => job.status === "active").length,
      change: "+2 this week",
      changeType: "increase",
      icon: Briefcase,
      color: "blue",
    },
    {
      title: "Total Applications",
      value: jobs.reduce((sum, job) => sum + job.applications, 0),
      change: "+18% from last month",
      changeType: "increase",
      icon: Users,
      color: "emerald",
    },
    {
      title: "Interviews Scheduled",
      value: 32,
      change: "+5 this week",
      changeType: "increase",
      icon: Calendar,
      color: "orange",
    },
    {
      title: "Hire Rate",
      value: "68%",
      change: "+4% from last month",
      changeType: "increase",
      icon: TrendingUp,
      color: "purple",
    },
  ];

  const applications = [
    {
      id: "1",
      candidateName: "Sarah Johnson",
      candidateEmail: "sarah.johnson@email.com",
      position: "Senior Frontend Developer",
      appliedDate: "2 days ago",
      rating: 4,
      status: "new",
      location: "San Francisco, CA",
      experience: "5+ years",
    },
    {
      id: "2",
      candidateName: "Michael Chen",
      candidateEmail: "michael.chen@email.com",
      position: "Product Manager",
      appliedDate: "1 day ago",
      rating: 5,
      status: "reviewing",
      location: "New York, NY",
      experience: "7+ years",
    },
    {
      id: "3",
      candidateName: "Emily Rodriguez",
      candidateEmail: "emily.rodriguez@email.com",
      position: "UX Designer",
      appliedDate: "3 days ago",
      rating: 4,
      status: "interviewed",
      location: "Austin, TX",
      experience: "4+ years",
    },
  ];

  const recentActivities = [
    {
      id: "1",
      type: "application",
      title: "New application received",
      description: "Sarah Johnson applied for Senior Frontend Developer",
      time: "2 hours ago",
    },
    {
      id: "2",
      type: "interview",
      title: "Interview scheduled",
      description: "Michael Chen - Product Manager position",
      time: "4 hours ago",
    },
    {
      id: "3",
      type: "view",
      title: "Job viewed",
      description: "UX Designer position viewed 15 times",
      time: "6 hours ago",
    },
    {
      id: "4",
      type: "message",
      title: "Message sent",
      description: "Follow-up sent to Emily Rodriguez",
      time: "1 day ago",
    },
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleJobSubmit = (createdJob) => {
    setIsJobFormOpen(false);

    // If we are already on page 0, the useEffect won't run.
    // So, we MUST fetch the data manually to see the new job.
    if (currentPage === 0) {
      fetchJobsForPage(0);
    } else {
      // If we are on a different page, this will trigger the useEffect.
      setCurrentPage(0);
    }
  };

  const handleJobEdit = (jobId) => {
    console.log("Edit job:", jobId);
  };

  const handleJobDelete = (jobId) => {
    setJobs((prev) => prev.filter((job) => job.id !== jobId));
  };

  const handleJobView = (jobId) => {
    console.log("View job:", jobId);
  };

  const handleApplicationStatusChange = (applicationId, status) => {
    console.log("Change application status:", applicationId, status);
  };

  if (activeTab === "dashboard") {
    return (
      <>
        <div className="p-6 space-y-6">
          {/* Header with Post Job Button */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard Overview
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your job postings and track applications
              </p>
            </div>
            <button
              onClick={() => setIsJobFormOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Post New Job
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Jobs Column */}
            <div className="xl:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Jobs
                </h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View all jobs
                </button>
              </div>
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onEdit={handleJobEdit}
                    onDelete={handleJobDelete}
                    onView={handleJobView}
                  />
                ))}
              </div>
            </div>

            {/* Activity Column */}
            <div>
              <RecentActivity activities={recentActivities} />
            </div>
          </div>

          {/* Recent Applications */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Applications
              </h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View all applications
              </button>
            </div>
            <div className="space-y-4">
              {applications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onStatusChange={handleApplicationStatusChange}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Job Form Modal */}
        <JobForm
          isOpen={isJobFormOpen}
          onClose={() => setIsJobFormOpen(false)}
          onJobCreated={handleJobSubmit}
        />
      </>
    );
  }

  if (activeTab === "jobs") {
    return <PostedJobs />;
  }

  // Placeholder for other tabs
  return (
    <div className="p-6">
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {activeTab
            ? activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
            : "Dashboard"}
        </h2>
        <p className="text-gray-600">This section is coming soon!</p>
      </div>
    </div>
  );
};

export default Dashboard;
