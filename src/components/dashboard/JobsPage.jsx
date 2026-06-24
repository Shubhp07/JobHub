import React, { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  DollarSign,
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  Users,
  Calendar,
  Star,
  ArrowRight
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

  // Accordion filters open state
  const [openFilters, setOpenFilters] = useState({
    search: false,
    department: false,
    jobType: false,
    experience: false,
    location: false,
  });

  const toggleFilter = (key) => {
    setOpenFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const savedAppliedJobs = localStorage.getItem("appliedJobs");
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

  const handleApplyClick = async (job) => {
    if (appliedJobs.has(job.id)) return;

    try {
      await apiApplyToJob(job.id);
      const newAppliedJobs = new Set(appliedJobs).add(job.id);
      setAppliedJobs(newAppliedJobs);
      localStorage.setItem("appliedJobs", JSON.stringify([...newAppliedJobs]));
      if (job.jobLink) {
        window.open(job.jobLink, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.error("Failed to apply for job:", error);
      if (error.message && error.message.includes("already applied")) {
        const newAppliedJobs = new Set(appliedJobs).add(job.id);
        setAppliedJobs(newAppliedJobs);
        localStorage.setItem("appliedJobs", JSON.stringify([...newAppliedJobs]));
      }
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const title = job.title || "";
    const company = job.company || "";
    const location = job.location || "";
    const department = job.department || "";

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Reuse experienceFilter for department/category if needed, or location
    const matchesLocation =
      !locationFilter || location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = !jobTypeFilter || job.jobType === jobTypeFilter;
    const matchesExperience = !experienceFilter || job.experienceLevel === experienceFilter;
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
          <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
        ))}
        {hasHalfStar && (
          <Star className="w-3 h-3 text-yellow-400 fill-current opacity-50" />
        )}
        <span className="text-xs text-slate-500 ml-1">{numRating.toFixed(1)}</span>
      </div>
    );
  };

  const departments = [
    "Engineering",
    "Marketing",
    "Sales",
    "Finance",
    "HR",
    "Operations",
  ];

  return (
    <div className="min-h-screen bg-spencePrimary text-slate-300">
      {/* Top Hero Heading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <h1 className="text-4xl font-bold font-serif text-white">
          Find Your Dream Job
        </h1>
        <p className="text-slate-400 mt-1">
          Discover opportunities that match your skills and interests
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Filter Card */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="border-2 border-spenceSecondary bg-spenceCard rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold font-serif text-white mb-4">
                Refine your search
              </h2>

              {/* Keywords Filter */}
              <div className="border-b border-dashed border-[#1e3d4c] py-4">
                <div
                  className="flex justify-between items-center cursor-pointer select-none"
                  onClick={() => toggleFilter("search")}
                >
                  <span className="font-serif font-semibold text-white">Keywords</span>
                  <span className="text-spenceSecondary font-bold text-lg">
                    {openFilters.search ? "−" : "+"}
                  </span>
                </div>
                {openFilters.search && (
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="e.g. Engineer, Developer"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-[#0a1a21] border border-[#1e3d4c] rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:ring-1 focus:ring-spenceSecondary focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              {/* Location Filter */}
              <div className="border-b border-dashed border-[#1e3d4c] py-4">
                <div
                  className="flex justify-between items-center cursor-pointer select-none"
                  onClick={() => toggleFilter("location")}
                >
                  <span className="font-serif font-semibold text-white">Location</span>
                  <span className="text-spenceSecondary font-bold text-lg">
                    {openFilters.location ? "−" : "+"}
                  </span>
                </div>
                {openFilters.location && (
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="e.g. San Francisco"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="w-full bg-[#0a1a21] border border-[#1e3d4c] rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:ring-1 focus:ring-spenceSecondary focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              {/* Job Type Filter */}
              <div className="border-b border-dashed border-[#1e3d4c] py-4">
                <div
                  className="flex justify-between items-center cursor-pointer select-none"
                  onClick={() => toggleFilter("jobType")}
                >
                  <span className="font-serif font-semibold text-white">Job Type</span>
                  <span className="text-spenceSecondary font-bold text-lg">
                    {openFilters.jobType ? "−" : "+"}
                  </span>
                </div>
                {openFilters.jobType && (
                  <div className="mt-3">
                    <select
                      value={jobTypeFilter}
                      onChange={(e) => setJobTypeFilter(e.target.value)}
                      className="w-full bg-[#0a1a21] border border-[#1e3d4c] rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-spenceSecondary focus:border-transparent"
                    >
                      <option value="">All Job Types</option>
                      <option value="FULL_TIME">Full-time</option>
                      <option value="PART_TIME">Part-time</option>
                      <option value="CONTRACT">Contract</option>
                      <option value="INTERNSHIP">Internship</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Experience Level Filter */}
              <div className="border-b border-dashed border-[#1e3d4c] py-4">
                <div
                  className="flex justify-between items-center cursor-pointer select-none"
                  onClick={() => toggleFilter("experience")}
                >
                  <span className="font-serif font-semibold text-white">Experience Level</span>
                  <span className="text-spenceSecondary font-bold text-lg">
                    {openFilters.experience ? "−" : "+"}
                  </span>
                </div>
                {openFilters.experience && (
                  <div className="mt-3">
                    <select
                      value={experienceFilter}
                      onChange={(e) => setExperienceFilter(e.target.value)}
                      className="w-full bg-[#0a1a21] border border-[#1e3d4c] rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-spenceSecondary focus:border-transparent"
                    >
                      <option value="">All Experience Levels</option>
                      <option value="ENTRY_LEVEL">Entry Level</option>
                      <option value="MID_LEVEL">Mid Level</option>
                      <option value="SENIOR_LEVEL">Senior Level</option>
                      <option value="EXECUTIVE">Executive Level</option>
                    </select>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Right Roles List */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-2">
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-sm">
                Showing {filteredJobs.length} available jobs
              </p>
            </div>

            <div className="divide-y divide-dotted divide-slate-700">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col md:flex-row md:items-start justify-between py-8 gap-6 first:pt-0"
                >
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                          <h3
                            onClick={() => setSelectedJob(job)}
                            className="text-2xl font-bold font-serif text-white hover:text-spenceSecondary cursor-pointer transition-colors"
                          >
                            {job.title}
                          </h3>
                          {renderStars(job.rating)}
                        </div>
                        
                        <p className="text-sm font-semibold text-spenceSecondary mb-3">
                          {job.company} &bull; {job.location}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className="p-2 hover:bg-spenceCard rounded-full transition-colors flex-shrink-0"
                      >
                        {savedJobs.has(job.id) ? (
                          <BookmarkCheck className="w-5 h-5 text-spenceSecondary" />
                        ) : (
                          <Bookmark className="w-5 h-5 text-slate-500" />
                        )}
                      </button>
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed mb-4 whitespace-pre-line">
                      {job.description}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {job.jobType.replace("_", " ")}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        {`$${job.salaryMin} - $${job.salaryMax}`}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* View Role Button */}
                  <div className="flex-shrink-0 flex items-center md:self-center">
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="bg-spenceSecondary hover:bg-[#e04523] text-white font-serif font-bold rounded-full py-2 pl-5 pr-2.5 inline-flex items-center gap-3 transition-all shadow-sm hover:shadow-spenceSecondary/25"
                    >
                      View Role
                      <span className="bg-white rounded-full p-1 flex items-center justify-center">
                        <ArrowRight className="w-3.5 h-3.5 text-spenceSecondary" />
                      </span>
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {filteredJobs.length === 0 && jobs.length > 0 && (
              <div className="text-center py-16 bg-spenceCard border border-[#1e3d4c] rounded-2xl p-8">
                <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold font-serif text-white mb-2">
                  No matches found
                </h3>
                <p className="text-slate-400 text-sm">
                  Try adjusting your search keywords or opening accordion filters.
                </p>
              </div>
            )}
          </div>

        </div>

        {selectedJob && (
          <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />
        )}
      </div>
    </div>
  );
};

export default JobsPage;
