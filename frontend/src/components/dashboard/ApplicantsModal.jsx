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
        <div className="bg-spenceCard border border-[#1e3d4c] rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative text-slate-300">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-spencePrimary hover:bg-spencePrimary/80 border border-[#1e3d4c] text-slate-400 transition-colors"
            aria-label="Close Applicants Modal"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-bold font-serif text-white mb-2">Applicants for {job.title}</h2>
          <p className="text-slate-400 mb-6">
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
                    className="border border-[#1e3d4c] bg-spencePrimary/40 rounded-xl p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold font-serif text-white text-lg flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-500" /> {app.userName}
                      </p>
                      <p className="text-sm text-slate-400 flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4 text-slate-500" /> {app.userEmail}
                      </p>
                    </div>
                    {app.resumeUrl ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedResumeUrl(app.resumeUrl)}
                          className="flex items-center gap-2 px-4 py-2 text-sm bg-spenceSecondary text-white rounded-full hover:bg-[#e04523] shadow-sm hover:shadow-spenceSecondary/25 transition-all"
                        >
                          <LinkIcon className="w-4 h-4" /> View Resume
                        </button>
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 text-sm bg-spenceCard border border-[#1e3d4c] text-slate-300 rounded-full hover:bg-spencePrimary/50 transition-all"
                        >
                          Download
                        </a>
                      </div>
                    ) : (
                      <span className="text-slate-500 italic text-sm">No Resume</span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500 py-8">No applications yet.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Resume Preview Modal (always above Applicants Modal) */}
      {selectedResumeUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-spenceCard border border-[#1e3d4c] rounded-2xl shadow-lg w-full max-w-3xl p-6 relative h-[80vh] flex flex-col text-slate-300">
            <button
              onClick={closeResumeModal}
              className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
              aria-label="Close Resume Viewer"
            >
              <X className="h-6 w-6" />
            </button>
            <h4 className="text-lg font-bold font-serif text-white mb-4">Resume Preview</h4>
            <iframe
              src={selectedResumeUrl}
              title="Resume Preview"
              width="100%"
              height="100%"
              className="border border-[#1e3d4c] rounded-lg flex-1"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicantsModal;
