// src/components/Employer-Dashboard/PostedJobs.jsx
import React, { useState, useEffect } from "react";
import {
  Search,
  Users,
  Eye,
  Edit,
  Power,
  PowerOff,
  MapPin,
  DollarSign,
} from "lucide-react";
import { getMyJobs } from "../../api/jobs";
import ApplicantsModal from "./ApplicantsModal";
import JobEditModal from "./JobEditModal";

// Mock function for updating job status (replace with real API call later)
const updateJobStatus = async (jobId, status) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Mock: Updated job ${jobId} to status ${status}`);
      resolve({ success: true });
    }, 500);
  });
};

const PostedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingApplicantsFor, setViewingApplicantsFor] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    loadPostedJobs();
  }, []);

  async function loadPostedJobs() {
    try {
      setLoading(true);
      const data = await getMyJobs();
      setJobs(data.content || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Filter jobs by search term (by title)
  const filteredJobs = jobs.filter(
    (job) =>
      job &&
      typeof job.title === "string" &&
      job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get status color and handle INACTIVE status
  const getStatusChipClass = (status) => {
    switch ((status || "").toUpperCase()) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 ring-green-600/20";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800 ring-gray-600/20";
      case "PAUSED":
        return "bg-yellow-100 text-yellow-800 ring-yellow-600/20";
      case "CLOSED":
        return "bg-red-100 text-red-800 ring-red-600/20";
      default:
        return "bg-gray-100 text-gray-800 ring-gray-600/20";
    }
  };

  const handleEditJob = (jobId) => {
    const jobToEdit = jobs.find((job) => job.id === jobId);
    setEditingJob(jobToEdit);
  };

  const handleToggleJobStatus = async (job) => {
    const currentStatus = (job.status || "ACTIVE").toUpperCase();
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const actionText = newStatus.toLowerCase();
    
    if (!window.confirm(`Are you sure you want to set "${job.title}" as ${actionText}?`)) {
      return;
    }

    try {
      setUpdatingStatus(job.id);
      
      // Call API to update job status (replace with real API call)
      await updateJobStatus(job.id, newStatus);
      
      // Update local state
      setJobs((prevJobs) =>
        prevJobs.map((j) =>
          j.id === job.id ? { ...j, status: newStatus } : j
        )
      );

      alert(`Job "${job.title}" has been set to ${actionText}.`);
    } catch (error) {
      console.error("Failed to update job status:", error);
      alert("Failed to update job status. Please try again.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleViewApplicants = (job) => {
    setViewingApplicantsFor(job);
  };

  if (loading)
    return <div className="p-8 text-center">Loading your job postings...</div>;
  if (error)
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;

  return (
    <>
      <div className="min-h-screen bg-gray-50/50 flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  My Job Postings
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage, edit, and view applicants for your jobs.
                </p>
              </div>
              <div className="relative flex-1 lg:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Job List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => {
                const isInactive = (job.status || "").toUpperCase() === "INACTIVE";
                
                return (
                  <div
                    key={job.id}
                    className={`bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 ${
                      isInactive ? "opacity-75" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                          {job.title}
                        </h2>
                        <div className="mb-2">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ring-1 ${getStatusChipClass(
                              job.status
                            )}`}
                          >
                            {job.status || "ACTIVE"}
                          </span>
                        </div>
                      </div>
                      {isInactive && (
                        <div className="px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <span className="text-sm text-yellow-700 font-medium">
                            Not visible to job seekers
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mb-3 text-gray-700">{job.company || ""}</div>
                    <div className="mb-1 text-gray-600">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      {job.location || ""}
                    </div>
                    <div className="mb-2 text-gray-600">
                      <DollarSign className="inline w-4 h-4 mr-1" />
                      {job.salaryMin} – {job.salaryMax}
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <Users className="w-5 h-5" />
                        <span className="font-medium text-gray-700">
                          {job.applicationCount != null ? job.applicationCount : 0} Applicants
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleViewApplicants(job)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" /> View Applicants
                        </button>
                        <button
                          onClick={() => handleEditJob(job.id)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          <Edit className="w-4 h-4" /> Edit
                        </button>
                        <button
                          onClick={() => handleToggleJobStatus(job)}
                          disabled={updatingStatus === job.id}
                          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            (job.status || "ACTIVE").toUpperCase() === "ACTIVE"
                              ? "text-orange-600 bg-orange-50 hover:bg-orange-100"
                              : "text-green-600 bg-green-50 hover:bg-green-100"
                          } ${updatingStatus === job.id ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {updatingStatus === job.id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              Updating...
                            </>
                          ) : (job.status || "ACTIVE").toUpperCase() === "ACTIVE" ? (
                            <>
                              <PowerOff className="w-4 h-4" /> Set Inactive
                            </>
                          ) : (
                            <>
                              <Power className="w-4 h-4" /> Set Active
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No jobs posted yet
                </h3>
                <p className="text-gray-600">Click "Post New Job" to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {editingJob && (
        <JobEditModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onUpdate={() => {
            setEditingJob(null);
            loadPostedJobs();
          }}
        />
      )}

      {viewingApplicantsFor && (
        <ApplicantsModal
          job={viewingApplicantsFor}
          onClose={() => setViewingApplicantsFor(null)}
        />
      )}
    </>
  );
};

export default PostedJobs;
