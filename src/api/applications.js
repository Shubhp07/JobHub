// src/api/applications.js

export const applyToJob = async (jobId) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("No auth token found. Please log in.");

  // The DTO on your backend is ApplicationCreateRequest, which expects a jobId.
  // We will send this in the body.
  const response = await fetch(`http://localhost:8080/api/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ jobId: jobId })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to submit application');
  }

  return await response.json();
};

export const getApplicantsForJob = async (jobId) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error("No auth token found.");

  // This endpoint matches the getJobApplications method in your service.
  // We pass the jobId in the URL and the backend gets the employer from the token.
  const response = await fetch(`http://localhost:8080/api/applications/job/${jobId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch applicants');
  }

  const data = await response.json();
  return data.content; // Your backend returns a Page object, we want the content array
};
