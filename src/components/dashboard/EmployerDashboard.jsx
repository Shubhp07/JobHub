import React, { useState, useEffect } from "react";
import StatsCard from "./StatsCard";
import JobCard from "./JobCard";
import ApplicationCard from "./ApplicationCard";
import PageHeader from "../shared/PageHeader";
import RecentActivity from "./RecentActivity";
import JobForm from "./JobForm";
// CORRECT: This is a default import
import PostedJobs from "./PostedJobs"; 


import {
  Briefcase,
  Users,
  Calendar,
  TrendingUp,
  Plus,
  Filter,
} from "lucide-react";

import { getMyJobs, createJob } from "../../api/jobs";
import { getEmployerApplications } from "../../api/applications";

const Dashboard = ({ activeTab }) => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [statsData, setStatsData] = useState({
    activeJobs: 0,
    totalApplications: 0,
    interviewsScheduled: 0,
    hireRate: "0%"
  });

  useEffect(() => {
    fetchJobsForPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchJobsForPage(currentPage);
      fetchEmployerStats();
    }
  }, [currentPage, activeTab]);

  const fetchJobsForPage = async (page) => {
    try {
      const result = await getMyJobs(page, 5);
      setJobs(result.content);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error(`Failed to load jobs for page ${page}:`, error.message);
    }
  };

  const fetchEmployerStats = async () => {
    try {
      // For total jobs, we'll fetch a large page just to get total active
      // Since getMyJobs is paginated, we can use totalElements
      const jobsRes = await getMyJobs(0, 100);
      const activeJobsCount = jobsRes.content?.filter(j => (j.status || "").toUpperCase() === "ACTIVE").length || 0;

      // Fetch all applications for stats
      const appsRes = await getEmployerApplications();
      const totalAppsCount = appsRes.totalElements || appsRes.content?.length || 0;
      const appsList = appsRes.content || (Array.isArray(appsRes) ? appsRes : []);

      const formattedApps = appsList.slice(0, 5).map((app, index) => ({
        id: app.id || app.applicationId || app.userId || String(index),
        candidateName: app.userName || app.candidateName || app.applicantName || app.user?.name || "Unknown Candidate",
        candidateEmail: app.userEmail || app.candidateEmail || app.applicantEmail || app.user?.email || "",
        position: app.jobTitle || app.job?.title || "Unknown Position",
        appliedDate: app.appliedAt || app.createdAt ? new Date(app.appliedAt || app.createdAt).toLocaleDateString() : "Recently",
        rating: app.rating || 0,
        status: app.status?.toLowerCase() || "new",
        location: app.location || app.job?.location || "Remote",
        experience: app.experience || "Not specified",
        avatar: app.avatar || null
      }));
      setApplications(formattedApps);

      const dynamicActivities = appsList.slice(0, 4).map((app, index) => {
        const candidateName = app.userName || app.candidateName || app.applicantName || app.user?.name || "A candidate";
        const position = app.jobTitle || app.job?.title || "a position";
        return {
          id: String(app.id || index),
          type: "application",
          title: "New application received",
          description: `${candidateName} applied for ${position}`,
          time: app.appliedAt || app.createdAt ? new Date(app.appliedAt || app.createdAt).toLocaleDateString() : "Recently",
        };
      });
      setActivities(dynamicActivities);

      // Fetch interviews scheduled
      const interviewsRes = await getEmployerApplications("INTERVIEW");
      const interviewsCount = interviewsRes.totalElements || interviewsRes.content?.length || 0;

      // Calculate approximate hire rate based on "OFFER" status, or mock it if no offers yet
      const offersRes = await getEmployerApplications("OFFER");
      const offersCount = offersRes.totalElements || offersRes.content?.length || 0;
      const calculatedRate = totalAppsCount > 0 ? Math.round((offersCount / totalAppsCount) * 100) : 0;

      setStatsData({
        activeJobs: activeJobsCount,
        totalApplications: totalAppsCount,
        interviewsScheduled: interviewsCount,
        hireRate: `${calculatedRate}%`
      });

    } catch (err) {
      console.error("Failed to fetch employer stats", err);
    }
  };

  // Stats Data
  const stats = [
    {
      title: "Active Jobs",
      value: statsData.activeJobs,
      change: "",
      changeType: "increase",
      icon: Briefcase,
      color: "blue",
    },
    {
      title: "Total Applications",
      value: statsData.totalApplications,
      change: "",
      changeType: "increase",
      icon: Users,
      color: "emerald",
    },
    {
      title: "Interviews Scheduled",
      value: statsData.interviewsScheduled,
      change: "",
      changeType: "increase",
      icon: Calendar,
      color: "orange",
    },
    {
      title: "Hire Rate",
      value: statsData.hireRate,
      change: "",
      changeType: "increase",
      icon: TrendingUp,
      color: "purple",
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
          <div className="-mx-6 -mt-6 mb-6">
            <PageHeader 
              title="Dashboard Overview"
              subtitle="Manage your job postings and track applications"
              buttonText="Post New Job"
              onButtonClick={() => setIsJobFormOpen(true)}
              showSearch={false}
              showViewToggle={false}
            />
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
              <RecentActivity activities={activities} />
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
