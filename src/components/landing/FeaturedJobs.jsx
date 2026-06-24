import React, { useState, useEffect, useRef } from "react";
import { Clock, DollarSign, ArrowRight, Search, Plus, Minus } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getAllJobs } from "../../api/jobs";
import JobDetailsModal from "../dashboard/JobDetailsModal";

gsap.registerPlugin(ScrollTrigger);

const fallbackJobs = [
  {
    id: 1,
    title: "Site Manager",
    company: "Spence Careers",
    location: "London, UK",
    jobType: "FULL_TIME",
    salaryMin: 55000,
    salaryMax: 70000,
    department: "Operations",
    description: "We are looking for a Site Manager who puts safety first, fully supporting the principle of \"Everyone Home Safe Every Day,\" while building and developing strong teams and supply partners. They lead with integrity, acting openly and respectfully with colleagues, clients, and the public, and foster a collaborative environment where best practice is shared and people feel confident to speak up. They take pride in delivering high-quality work correctly, on time, and in full, while maintaining a clear focus on sustainability and long-term success.",
    requirements: "Safety certifications\n5+ years of experience in construction management\nLeadership skills\nSustainable practice orientation",
    benefits: "Competitive salary\nHealth insurance\nRemote options\nCar allowance",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Project Manager",
    company: "Spence Careers",
    location: "London, UK",
    jobType: "FULL_TIME",
    salaryMin: 60000,
    salaryMax: 80000,
    department: "Engineering",
    description: "We are looking for a Project Manager with experience in rail infrastructure or related sectors to oversee the planning and execution of project deliverables. This role requires strong stakeholder management skills, budget planning proficiency, and an excellent track record of safe project delivery.",
    requirements: "PMP or equivalent certification\nRail or civil engineering background\nExperience leading mid-to-large scale projects",
    benefits: "Sabbatical benefits\nCompany shares\nComprehensive health package",
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: "Estimator",
    company: "Spence Careers",
    location: "Manchester, UK",
    jobType: "CONTRACT",
    salaryMin: 45000,
    salaryMax: 60000,
    department: "Finance",
    description: "Responsible for managing and estimating costs for major civil engineering bids. Must possess strong analytical skills and work closely with procurement teams.",
    requirements: "Degree in Quantity Surveying or Civil Engineering\n3+ years experience in cost estimation\nAdvanced Excel skills",
    benefits: "Bonus scheme\nProfessional training support\nFlexible working hours",
    createdAt: new Date().toISOString()
  }
];

const FeaturedJobs = () => {
  const sectionRef = useRef(null);
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [hoveredJobId, setHoveredJobId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  // Accordion filters open state
  const [openFilters, setOpenFilters] = useState({
    category: true,
    jobType: true,
  });

  const toggleFilter = (key) => {
    setOpenFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await getAllJobs();
        const apiJobs = response.content || [];
        setJobs(apiJobs.length > 0 ? apiJobs : fallbackJobs);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        setJobs(fallbackJobs);
      }
    }
    fetchJobs();
  }, []);

  // GSAP Entrance Animations
  useEffect(() => {
    if (jobs.length === 0) return;
    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo('.featured-header', 
        { opacity: 0, y: 40, scale: 0.95 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Left filter panel reveal
      gsap.fromTo('.filter-panel',
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.filter-panel',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );

      // Right list items reveal
      gsap.fromTo('.job-row',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.job-list-container',
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [jobs]);

  const filteredJobs = jobs.filter((job) => {
    const title = job.title || "";
    const company = job.company || "";
    const department = job.department || "";
    const jobType = job.jobType || "";

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || department.toLowerCase() === selectedCategory.toLowerCase();
    const matchesType = !selectedJobType || jobType === selectedJobType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const categories = Array.from(new Set(jobs.map((j) => j.department).filter(Boolean)));
  const jobTypes = Array.from(new Set(jobs.map((j) => j.jobType).filter(Boolean)));

  return (
    <section 
      id="vacancies"
      ref={sectionRef}
      className="py-24 bg-spencePrimary border-t border-[#1e3d4c] relative overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-spenceSecondary/3 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="featured-header text-center mb-16 opacity-0">
          <h2 className="text-3xl md:text-5xl font-bold font-serif text-white mb-4">
            Current Vacancies
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Discover premium career opportunities tailored to your professional path.
          </p>
        </div>

        {/* Main Search & Filter Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Refine Search Sidebar */}
          <div className="filter-panel lg:col-span-4 opacity-0">
            <div className="border-2 border-spenceSecondary bg-spenceCard rounded-2xl p-6 shadow-xl">
              <h3 className="text-2xl font-bold font-serif text-white mb-4">
                Refine your search
              </h3>

              {/* Keywords Input */}
              <div className="border-b border-dashed border-[#1e3d4c] py-4">
                <input
                  type="text"
                  placeholder="Keywords (e.g. Manager, Engineer)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#0a1a21] border border-[#1e3d4c] rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:ring-1 focus:ring-spenceSecondary focus:border-transparent text-sm"
                />
              </div>

              {/* Category (Department) Accordion */}
              <div className="border-b border-dashed border-[#1e3d4c] py-4">
                <button
                  className="w-full flex justify-between items-center text-white hover:text-spenceSecondary transition-colors font-serif font-semibold text-left focus:outline-none"
                  onClick={() => toggleFilter("category")}
                >
                  <span>Category</span>
                  <span className="text-spenceSecondary text-lg font-bold">
                    {openFilters.category ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                <div 
                  className="transition-all duration-300 ease-in-out overflow-hidden"
                  style={{ 
                    maxHeight: openFilters.category ? "240px" : "0px", 
                    opacity: openFilters.category ? 1 : 0,
                    marginTop: openFilters.category ? "12px" : "0px"
                  }}
                >
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    <button
                      onClick={() => setSelectedCategory("")}
                      className="flex items-center gap-3 w-full text-left text-sm py-2 px-2.5 rounded-lg hover:bg-white/5 transition-all text-slate-300 hover:text-white group"
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                        !selectedCategory 
                          ? "border-spenceSecondary bg-spenceSecondary/10" 
                          : "border-slate-600 group-hover:border-spenceSecondary/50"
                      }`}>
                        {!selectedCategory && <div className="w-1.5 h-1.5 rounded-full bg-spenceSecondary" />}
                      </div>
                      <span className={!selectedCategory ? "font-bold text-white" : "text-slate-400 group-hover:text-slate-200"}>
                        All Categories
                      </span>
                    </button>
                    {categories.map((cat) => {
                      const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className="flex items-center gap-3 w-full text-left text-sm py-2 px-2.5 rounded-lg hover:bg-white/5 transition-all text-slate-300 hover:text-white group"
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                            isSelected 
                              ? "border-spenceSecondary bg-spenceSecondary/10" 
                              : "border-slate-600 group-hover:border-spenceSecondary/50"
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-spenceSecondary" />}
                          </div>
                          <span className={isSelected ? "font-bold text-white" : "text-slate-400 group-hover:text-slate-200"}>
                            {cat}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Job Type Accordion */}
              <div className="border-b border-dashed border-[#1e3d4c] py-4">
                <button
                  className="w-full flex justify-between items-center text-white hover:text-spenceSecondary transition-colors font-serif font-semibold text-left focus:outline-none"
                  onClick={() => toggleFilter("jobType")}
                >
                  <span>Job Type</span>
                  <span className="text-spenceSecondary text-lg font-bold">
                    {openFilters.jobType ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                <div 
                  className="transition-all duration-300 ease-in-out overflow-hidden"
                  style={{ 
                    maxHeight: openFilters.jobType ? "200px" : "0px", 
                    opacity: openFilters.jobType ? 1 : 0,
                    marginTop: openFilters.jobType ? "12px" : "0px"
                  }}
                >
                  <div className="space-y-1.5">
                    <button
                      onClick={() => setSelectedJobType("")}
                      className="flex items-center gap-3 w-full text-left text-sm py-2 px-2.5 rounded-lg hover:bg-white/5 transition-all text-slate-300 hover:text-white group"
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                        !selectedJobType 
                          ? "border-spenceSecondary bg-spenceSecondary/10" 
                          : "border-slate-600 group-hover:border-spenceSecondary/50"
                      }`}>
                        {!selectedJobType && <div className="w-1.5 h-1.5 rounded-full bg-spenceSecondary" />}
                      </div>
                      <span className={!selectedJobType ? "font-bold text-white" : "text-slate-400 group-hover:text-slate-200"}>
                        All Job Types
                      </span>
                    </button>
                    {jobTypes.map((type) => {
                      const isSelected = selectedJobType === type;
                      return (
                        <button
                          key={type}
                          onClick={() => setSelectedJobType(type)}
                          className="flex items-center gap-3 w-full text-left text-sm py-2 px-2.5 rounded-lg hover:bg-white/5 transition-all text-slate-300 hover:text-white group"
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                            isSelected 
                              ? "border-spenceSecondary bg-spenceSecondary/10" 
                              : "border-slate-600 group-hover:border-spenceSecondary/50"
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-spenceSecondary" />}
                          </div>
                          <span className={isSelected ? "font-bold text-white" : "text-slate-400 group-hover:text-slate-200"}>
                            {type.replace("_", " ")}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Job Listings List */}
          <div className="job-list-container lg:col-span-8 space-y-4">
            <div className="flex flex-col gap-6">
              {filteredJobs.map((job) => {
                const isHovered = hoveredJobId === job.id;
                
                return (
                  <div
                    key={job.id}
                    onMouseEnter={() => setHoveredJobId(job.id)}
                    onMouseLeave={() => setHoveredJobId(null)}
                    className={`job-row py-10 px-8 transition-all duration-300 rounded-2xl flex flex-col justify-between gap-5 ${
                      isHovered 
                        ? "border-2 border-spenceSecondary bg-spenceCard shadow-2xl scale-[1.01]" 
                        : "border-2 border-transparent bg-transparent"
                    }`}
                  >
                    <div className="w-full">
                      {/* Inline Header Row */}
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <h3
                          onClick={() => setSelectedJob(job)}
                          className="text-3xl font-bold font-serif text-white hover:text-spenceSecondary cursor-pointer transition-colors"
                        >
                          {job.title}
                        </h3>

                        <div className="flex-shrink-0">
                          <button
                            onClick={() => setSelectedJob(job)}
                            className="bg-spenceSecondary hover:bg-[#e04523] text-white font-serif font-bold rounded-full py-1.5 pl-4 pr-2 inline-flex items-center gap-2 transition-all shadow-sm hover:shadow-spenceSecondary/25 text-xs"
                          >
                            View Role
                            <span className="bg-white rounded-full p-1 flex items-center justify-center">
                              <ArrowRight className="w-3 h-3 text-spenceSecondary" />
                            </span>
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-base font-semibold text-spenceSecondary mb-5">
                        {job.company} &bull; {job.location}
                      </p>

                      <p className="text-slate-300 text-base leading-relaxed mb-5 whitespace-pre-line">
                        {job.description}
                      </p>

                      {/* Metadata tags */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4.5 h-4.5" />
                          {job.jobType.replace("_", " ")}
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1.5">
                          <DollarSign className="w-4.5 h-4.5" />
                          {`$${job.salaryMin} - $${job.salaryMax}`}
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-16 bg-spenceCard border border-[#1e3d4c] rounded-2xl p-8">
                <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold font-serif text-white mb-2">
                  No matches found
                </h3>
                <p className="text-slate-400 text-sm">
                  Try adjusting your keywords or clearing selected filters.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      {selectedJob && (
        <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </section>
  );
};

export default FeaturedJobs;