import React from "react";
import { Building, Tag, MapPin, Clock, Users, DollarSign, Link } from "lucide-react";

const BasicInfoFields = ({ formData, setFormData, handleChange, errors }) => {
  const departments = [
    "Engineering",
    "Marketing",
    "Sales",
    "Finance",
    "HR",
    "Operations",
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Building className="w-4 h-4 inline mr-1" />
            Job Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.title ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
            placeholder="e.g. Senior Frontend Developer"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Building className="w-4 h-4 inline mr-1" />
            Company *
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                company: e.target.value,
              }))
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.company ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
            placeholder="e.g. Acme Corp"
          />
          {errors.company && (
            <p className="text-red-500 text-sm mt-1">{errors.company}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Tag className="w-4 h-4 inline mr-1" />
            Department *
          </label>
          <select
            value={formData.department}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                department: e.target.value,
              }))
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.department ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {errors.department && (
            <p className="text-red-500 text-sm mt-1">{errors.department}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Location *
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                location: e.target.value,
              }))
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.location ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
            placeholder="e.g. San Francisco, CA"
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">{errors.location}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Job Type
          </label>
          <select
            value={formData.jobType}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, jobType: e.target.value }))
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="FULL_TIME">Full-time</option>
            <option value="PART_TIME">Part-time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="w-4 h-4 inline mr-1" />
            Experience Level
          </label>
          <select
            value={formData.experienceLevel}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                experienceLevel: e.target.value,
              }))
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="ENTRY_LEVEL">Entry Level (0-2 years)</option>
            <option value="MID_LEVEL">Mid Level (3-5 years)</option>
            <option value="SENIOR_LEVEL">Senior Level (6+ years)</option>
            <option value="EXECUTIVE">Executive Level</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 inline mr-1" />
            Salary Range *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="number"
                value={formData.salaryMin}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    salaryMin: e.target.value,
                  }))
                }
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.salaryMin ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Min ($)"
              />
              {errors.salaryMin && (
                <p className="text-red-500 text-xs mt-1">{errors.salaryMin}</p>
              )}
            </div>
            <div>
              <input
                type="number"
                value={formData.salaryMax}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    salaryMax: e.target.value,
                  }))
                }
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.salaryMax ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Max ($)"
              />
              {errors.salaryMax && (
                <p className="text-red-500 text-xs mt-1">{errors.salaryMax}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Link className="w-4 h-4 inline mr-1" />
          Application Link (Optional)
        </label>
        <input
          type="url"
          name="jobLink"
          value={formData.jobLink}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            errors.jobLink ? "border-red-300 bg-red-50" : "border-gray-300"
          }`}
          placeholder="https://your-company.com/careers/apply-here"
        />
        {errors.jobLink && (
          <p className="text-red-500 text-sm mt-1">{errors.jobLink}</p>
        )}
      </div>
    </>
  );
};

export default BasicInfoFields;
