// src/components/Employer-Dashboard/ApplicantsModal.jsx

import React, { useState, useEffect } from 'react';
import { getApplicantsForJob } from '../../api/applications';
import { X, User, Mail, Link as LinkIcon } from 'lucide-react';

const ApplicantsModal = ({ job, onClose }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!job) return;

    const fetchApplicants = async () => {
      try {
        setLoading(true);
        const data = await getApplicantsForJob(job.id);
        setApplicants(data);
      } catch (err) {
        setError(err.message);
        console.error("Failed to load applicants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [job]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-2">Applicants for {job.title}</h2>
        <p className="text-gray-600 mb-6">
          {applicants.length} candidate(s) have applied for this role.
        </p>

        {loading && <p>Loading applicants...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && !error && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {applicants.length > 0 ? (
              applicants.map((app) => (
                <div key={app.userId} className="border rounded-md p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-lg flex items-center gap-2">
                      <User className="w-4 h-4" /> {app.userName}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4" /> {app.userEmail} {/* You might need to add userEmail to ApplicationResponse */}
                    </p>
                  </div>
                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <LinkIcon className="w-4 h-4" /> View Resume
                  </a>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No applications yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantsModal;
