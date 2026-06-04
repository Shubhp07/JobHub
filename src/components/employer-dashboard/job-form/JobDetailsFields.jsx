import React from "react";
import { FileText } from "lucide-react";

const JobDetailsFields = ({ formData, setFormData, errors }) => {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="w-4 h-4 inline mr-1" />
          Job Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          rows={4}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
            errors.description
              ? "border-red-300 bg-red-50"
              : "border-gray-300"
          }`}
          placeholder="Describe the role, responsibilities, and what makes this position exciting..."
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Requirements *
        </label>
        <textarea
          value={formData.requirements}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              requirements: e.target.value,
            }))
          }
          rows={4}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
            errors.requirements
              ? "border-red-300 bg-red-50"
              : "border-gray-300"
          }`}
          placeholder="List the required qualifications, skills, and experience..."
        />
        {errors.requirements && (
          <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Benefits & Perks
        </label>
        <textarea
          value={formData.benefits}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, benefits: e.target.value }))
          }
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
          placeholder="Health insurance, 401k, flexible hours, remote work options..."
        />
      </div>
    </>
  );
};

export default JobDetailsFields;
