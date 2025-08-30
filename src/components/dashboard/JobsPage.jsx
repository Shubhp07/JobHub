import React, { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  DollarSign,
  Building,
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Users,
  Calendar,
  Star,
} from "lucide-react";
import { getAllJobs } from "../../api/jobs";
import JobDetailsModal from "./JobDetailsModal";
import { applyToJob as apiApplyToJob } from "../../api/applications";

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    // Load applied jobs from localStorage on component mount
    const savedAppliedJobs = localStorage.getItem('appliedJobs');
    if (savedAppliedJobs) {
      setAppliedJobs(new Set(JSON.parse(savedAppliedJobs)));
    }

    async function fetchJobs() {
      try {
        const response = await getAllJobs();
        setJobs(response.content || []);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    }
    fetchJobs();
  }, []);

  const createListFromString = (text) => {
    if (Array.isArray(text)) return text;
    if (typeof text === "string")
      return text.split("\n").filter((item) => item.trim() !== "");
    return [];
  };

  const handleApplyClick = async (job) => {
    if (appliedJobs.has(job.id)) return;

    try {
      await apiApplyToJob(job.id);
      
      // Update applied jobs state
      const newAppliedJobs = new Set(appliedJobs).add(job.id);
      setAppliedJobs(newAppliedJobs);
      
      // Save to localStorage for persistence
      localStorage.setItem('appliedJobs', JSON.stringify([...newAppliedJobs]));
      
      if (job.jobLink) {
        window.open(job.jobLink, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.error("Failed to apply for job:", error);
      
      // If error says already applied, add to applied jobs to hide it
      if (error.message && error.message.includes("already applied")) {
        const newAppliedJobs = new Set(appliedJobs).add(job.id);
        setAppliedJobs(newAppliedJobs);
        localStorage.setItem('appliedJobs', JSON.stringify([...newAppliedJobs]));
      }
    }
  };

  const safeFirstChar = (str) =>
    typeof str === "string" && str.length > 0 ? str.charAt(0) : "";

  // Filter jobs to EXCLUDE applied jobs
  const filteredJobs = jobs.filter((job) => {
    const title = job.title || "";
    const company = job.company || "";
    const location = job.location || "";

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      !locationFilter || location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = !jobTypeFilter || job.jobType === jobTypeFilter;
    const matchesExperience = !experienceFilter || job.experienceLevel === experienceFilter;
    
    // KEY: Exclude applied jobs
    const notApplied = !appliedJobs.has(job.id);

    return matchesSearch && matchesLocation && matchesType && matchesExperience && notApplied;
  });

  const toggleSaveJob = (jobId) => {
    setSavedJobs((prev) => {
      const newSaved = new Set(prev);
      if (newSaved.has(jobId)) newSaved.delete(jobId);
      else newSaved.add(jobId);
      return newSaved;
    });
  };

  const renderStars = (rating) => {
    const numRating = Number(rating) || 0;
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 !== 0;
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: fullStars }, (_, i) => (
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
        ))}
        {hasHalfStar && (
          <Star className="w-4 h-4 text-yellow-400 fill-current opacity-50" />
        )}
        <span className="text-sm text-gray-600 ml-1">{numRating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Find Your Dream Job
              </h1>
              <p className="text-gray-600 mt-1">
                Discover opportunities that match your skills and interests
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 lg:w-2/3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs or companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {filteredJobs.length} available jobs
          </p>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>

        <div className="space-y-6">
          {filteredJobs.map((job) => {
            const requirementsList = createListFromString(job.requirements || "");
            const benefitsList = createListFromString(job.benefits || "");

            return (
              <div
                key={job.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl font-semibold">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={`${job.company} logo`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        safeFirstChar(job.company)
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-lg text-gray-700 font-medium">
                              {job.company}
                            </p>
                            {renderStars(job.rating)}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleSaveJob(job.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {savedJobs.has(job.id) ? (
                            <BookmarkCheck className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Bookmark className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.jobType}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {`$${job.salaryMin} - $${job.salaryMax}`}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {job.experienceLevel}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(job.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {requirementsList.slice(0, 3).map((req, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                          >
                            {req}
                          </span>
                        ))}
                        {requirementsList.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                            +{requirementsList.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {benefitsList.slice(0, 2).map((benefit, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs"
                      >
                        {benefit}
                      </span>
                    ))}
                    {benefitsList.length > 2 && (
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs">
                        +{benefitsList.length - 2} benefits
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" /> View Details
                    </button>
                    <button
                      onClick={() => handleApplyClick(job)}
                      className="px-6 py-2 rounded-lg font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredJobs.length === 0 && jobs.length > 0 && (
          <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No available jobs found</h3>
            <p className="text-gray-600">All jobs matching your criteria have been applied to or try adjusting your search filters</p>
          </div>
        )}

        {selectedJob && (
          <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />
        )}
      </div>
    </div>
  );
};

export default JobsPage;
