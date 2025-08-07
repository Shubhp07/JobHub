// src/api/jobs.js

// Create a new Job (Employer use)
export async function createJob(jobData) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("No JWT token found. Please login again.");
    return;
  }

  const response = await fetch('http://localhost:8080/api/jobs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(jobData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create job');
  }

  return await response.json();
}

// Get all jobs (for job seekers - PUBLIC)
export async function getAllJobs(page = 0, size = 5) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `http://localhost:8080/api/jobs?page=${page}&size=${size}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch jobs");
  }

  // Returns a Page object: { content: [...], ... }
  return await response.json();
}

// Get jobs posted by the CURRENT EMPLOYER (for Employer Dashboard)
export async function getMyJobs(page = 0, size = 10) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found. Please log in.");
  }

  const response = await fetch(
    `http://localhost:8080/api/jobs/my-jobs?page=${page}&size=${size}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch your posted jobs");
  }

  // Returns a Page object: { content: [...], ... }
  return await response.json();
}
