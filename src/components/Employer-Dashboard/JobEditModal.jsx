import React, { useState, useEffect } from "react";

const JobEditModal = ({ job, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    status: "",
    requirements: "",
    jobType: "",
    experienceLevel: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Populate form data on job change
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || "",
        description: job.description || "",
        location: job.location || "",
        salaryMin: job.salaryMin != null ? job.salaryMin.toString() : "",
        salaryMax: job.salaryMax != null ? job.salaryMax.toString() : "",
        status: job.status || "ACTIVE",
        requirements: job.requirements || "",
        jobType: job.jobType || "",
        experienceLevel: job.experienceLevel || "",
      });
    }
  }, [job]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "salaryMin" || name === "salaryMax") {
      // Allow only numbers and decimal points
      setFormData((prev) => ({
        ...prev,
        [name]: value.replace(/[^\d.]/g, ""),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Basic form validation
  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!formData.location.trim()) {
      setError("Location is required");
      return false;
    }
    if (!formData.requirements.trim()) {
      setError("Requirements are required");
      return false;
    }
    if (!formData.jobType) {
      setError("Job type is required");
      return false;
    }
    if (!formData.experienceLevel) {
      setError("Experience level is required");
      return false;
    }
    if (!formData.salaryMin) {
      setError("Minimum salary is required");
      return false;
    }
    if (!formData.salaryMax) {
      setError("Maximum salary is required");
      return false;
    }
    if (parseFloat(formData.salaryMin) >= parseFloat(formData.salaryMax)) {
      setError("Maximum salary must be greater than minimum salary");
      return false;
    }
    setError(null);
    return true;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token missing");

      const payload = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        salaryMin: parseFloat(formData.salaryMin),
        salaryMax: parseFloat(formData.salaryMax),
        status: formData.status,
        requirements: formData.requirements,
        jobType: formData.jobType,
        experienceLevel: formData.experienceLevel,
      };

      const response = await fetch(`http://localhost:8080/api/jobs/${job.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to update job");
      }

      if (onUpdate) onUpdate();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      onClick={handleBackgroundClick}
      aria-modal="true"
      role="dialog"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 max-w-xl w-full max-h-[90vh] overflow-auto"
        noValidate
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">
          Edit Job: {job.title}
        </h2>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-red-700 font-medium" role="alert">
            {error}
          </div>
        )}

        {/* Title */}
        <div className="mb-5">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-600">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            disabled={loading}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Requirements */}
        <div className="mb-5">
          <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
            Requirements <span className="text-red-600">*</span>
          </label>
          <textarea
            id="requirements"
            name="requirements"
            rows={4}
            value={formData.requirements}
            onChange={handleChange}
            disabled={loading}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Job Type */}
        <div className="mb-5">
          <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
            Job Type <span className="text-red-600">*</span>
          </label>
          <select
            id="jobType"
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            disabled={loading}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Job Type</option>
            <option value="FULL_TIME">Full-Time</option>
            <option value="PART_TIME">Part-Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
        </div>

        {/* Experience Level */}
        <div className="mb-5">
          <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1">
            Experience Level <span className="text-red-600">*</span>
          </label>
          <select
            id="experienceLevel"
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleChange}
            disabled={loading}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Experience Level</option>
            <option value="ENTRY_LEVEL">Entry Level</option>
            <option value="MID_LEVEL">Mid Level</option>
            <option value="SENIOR_LEVEL">Senior Level</option>
            <option value="EXECUTIVE_LEVEL">Executive Level</option>
          </select>
        </div>

        {/* Location */}
        <div className="mb-5">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location <span className="text-red-600">*</span>
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            disabled={loading}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Salary Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Salary
            </label>
            <input
              id="salaryMin"
              name="salaryMin"
              type="text"
              value={formData.salaryMin}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
          <div>
            <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Salary
            </label>
            <input
              id="salaryMax"
              name="salaryMax"
              type="text"
              value={formData.salaryMax}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-md text-white ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } transition-colors`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobEditModal;
