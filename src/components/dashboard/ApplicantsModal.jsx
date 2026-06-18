import React, { useState, useEffect } from 'react';
import { getApplicantsForJob } from '../../api/applications';
import { X, User, Mail, Link as LinkIcon } from 'lucide-react';

const ApplicantsModal = ({ job, onClose }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResumeUrl, setSelectedResumeUrl] = useState(null); // For inline resume preview modal

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

  // Close resume preview modal callback
  const closeResumeModal = () => setSelectedResumeUrl(null);

  return (
    <>
      {/* Applicants Modal */}  
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200"
            aria-label="Close Applicants Modal"
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
                  <div
                    key={app.userId}
                    className="border rounded-md p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-lg flex items-center gap-2">
                        <User className="w-4 h-4" /> {app.userName}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4" /> {app.userEmail}
                      </p>
                    </div>
                    {app.resumeUrl ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedResumeUrl(app.resumeUrl)}
                          className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          <LinkIcon className="w-4 h-4" /> View Resume
                        </button>
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                          Download
                        </a>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-sm">No Resume</span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No applications yet.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Resume Preview Modal (always above Applicants Modal) */}
      {selectedResumeUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative h-[80vh] flex flex-col">
            <button
              onClick={closeResumeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              aria-label="Close Resume Viewer"
            >
              <X className="h-6 w-6" />
            </button>
            <h4 className="text-lg font-semibold mb-4">Resume Preview</h4>
            <iframe
              src={selectedResumeUrl}
              title="Resume Preview"
              width="100%"
              height="100%"
              className="border rounded-md flex-1"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicantsModal;
