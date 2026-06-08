// src/api/applications.js

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const applyToJob = async (jobId) => {
  const response = await fetch(`http://localhost:8080/api/applications`, {
    method: 'POST',
    credentials: "include",
    headers: getAuthHeaders(),
    body: JSON.stringify({ jobId: jobId })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to submit application');
  }

  return await response.json();
};

export const getApplicantsForJob = async (jobId) => {
  const response = await fetch(`http://localhost:8080/api/applications/job/${jobId}`, {
    credentials: "include",
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error('Failed to fetch applicants');
  }

  const data = await response.json();
  return data.content;
};
