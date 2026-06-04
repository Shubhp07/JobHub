import React from "react";
import { X, MapPin, Clock, DollarSign, Users, Calendar } from "lucide-react";

export default function JobDetailsModal({ job, onClose }) {
  if (!job) return null;

  // Helper to parse multi-line strings or arrays into arrays of strings
  const parseList = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string")
      return value.split("\n").filter((line) => line.trim() !== "");
    return [];
  };

  const requirements = parseList(job.requirements);
  const benefits = parseList(job.benefits);

  // Format application deadline safely or show 'N/A' if absent
  const formattedDeadline = job.applicationDeadline
    ? new Date(job.applicationDeadline).toLocaleDateString()
    : "N/A";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="job-modal-title"
    >
      <div className="relative max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close job details"
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <h2 id="job-modal-title" className="text-2xl font-bold mb-1">
          {job.title || "Untitled Job"}
        </h2>
        <p className="text-lg text-gray-600 mb-3">
          {job.company || "Unknown Company"}
        </p>

        {/* Metadata */}
        <div className="mb-4 flex flex-wrap gap-x-6 gap-y-3 text-gray-600">
          <span className="flex items-center gap-1">
            <MapPin className="w-5 h-5" aria-hidden="true" />
            {job.location || "Location not specified"}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-5 h-5" aria-hidden="true" />
            {job.jobType || "Job type not specified"}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-5 h-5" aria-hidden="true" />
            {job.experienceLevel || "Experience level not specified"}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="w-5 h-5" aria-hidden="true" />
            {job.salaryMin && job.salaryMax
              ? `$${job.salaryMin} - $${job.salaryMax}`
              : "Salary not specified"}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-5 h-5" aria-hidden="true" />
            {formattedDeadline}
          </span>
        </div>

        <hr className="mb-6 border-gray-300" />

        {/* Job Description */}
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Job Description</h3>
          <p className="whitespace-pre-wrap text-gray-800">
            {job.description || "No description provided."}
          </p>
        </section>

        {/* Requirements */}
        {requirements.length > 0 && (
          <section className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Requirements</h3>
            <ul className="list-disc list-inside text-gray-800 space-y-1">
              {requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Benefits */}
        {benefits.length > 0 && (
          <section className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Benefits & Perks</h3>
            <ul className="list-disc list-inside text-gray-800 space-y-1">
              {benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Application Link */}
        {job.jobLink ? (
          <a
            href={job.jobLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Apply on Company Portal
          </a>
        ) : (
          <p className="mt-4 text-gray-500 italic">
            Application link not provided.
          </p>
        )}
      </div>
    </div>
  );
}
