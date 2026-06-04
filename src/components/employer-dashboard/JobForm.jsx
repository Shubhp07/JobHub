import React, { useState } from "react";
import { X } from "lucide-react";
import { createJob } from "../../api/jobs";
import { toast } from "react-toastify";

// Subcomponents
import BasicInfoFields from "./job-form/BasicInfoFields";
import JobDetailsFields from "./job-form/JobDetailsFields";
import SkillsField from "./job-form/SkillsField";

const JobForm = ({ isOpen, onClose, onJobCreated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    jobType: "FULL_TIME",
    experienceLevel: "MID_LEVEL",
    salaryMin: "",
    salaryMax: "",
    description: "",
    requirements: "",
    company: "",
    companyLogo: "",
    applicationDeadline: "",
    skills: [],
    jobLink: "https://company.example.com/apply",
    benefits: "", // Added to state
    remote: false,
    urgent: false,
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Job title is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.description.trim())
      newErrors.description = "Job description is required";
    if (!formData.requirements.trim())
      newErrors.requirements = "Requirements are required";
    if (!formData.salaryMin) newErrors.salaryMin = "Minimum salary is required";
    if (!formData.salaryMax) newErrors.salaryMax = "Maximum salary is required";
    if (
      formData.salaryMin &&
      formData.salaryMax &&
      Number(formData.salaryMin) >= Number(formData.salaryMax)
    ) {
      newErrors.salaryMax = "Maximum salary must be greater than minimum";
    }
    if (
      formData.jobLink &&
      !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(formData.jobLink)
    ) {
      newErrors.jobLink = "Please enter a valid URL";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    const jobData = {
      title: formData.title,
      description: formData.description,
      requirements: formData.requirements,
      location: formData.location,
      jobType: formData.jobType || "FULL_TIME",
      experienceLevel: formData.experienceLevel || "MID_LEVEL",
      salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : null,
      salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : null,
      company: formData.company || "",
      companyLogo: formData.companyLogo || "",
      applicationDeadline: formData.applicationDeadline || null,
      jobLink: formData.jobLink || "",
      skills: formData.skills,
    };

    try {
      const createdJob = await createJob(jobData);
      onJobCreated(createdJob);
      handleClose();
      toast.success("Job created successfully!");
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("This job already exists. Please change the title or location.");
      } else {
        console.error("Error creating job:", error);
        toast.error("Something went wrong while creating the job. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      company: "",
      department: "",
      location: "",
      jobType: "FULL_TIME",
      experienceLevel: "MID_LEVEL",
      salaryMin: "",
      salaryMax: "",
      description: "",
      requirements: "",
      companyLogo: "",
      applicationDeadline: "",
      jobLink: "https://company.example.com/apply",
      skills: [],
      benefits: "",
      remote: false,
      urgent: false,
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Post New Job</h2>
            <p className="text-sm text-gray-600 mt-1">
              Fill in the details to create a new job posting
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-6">
            {submissionError && <p className="text-red-600 text-sm">{submissionError}</p>}

            {/* Basic Information */}
            <BasicInfoFields
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              errors={errors}
            />

            {/* Job Description & Details */}
            <JobDetailsFields
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />

            {/* Skills */}
            <SkillsField formData={formData} setFormData={setFormData} />

            {/* Options */}
            <div className="flex gap-6 mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.remote}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      remote: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Remote work available</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.urgent}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      urgent: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">Urgent hiring</span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Posting..." : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
