import React, { createContext, useContext, useState } from 'react';
import { API_BASE_URL } from '../config';

const JobContext = createContext();

export const useJobContext = () => useContext(JobContext);

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);

  // ✅ FIX #7: postJob now calls the real backend API and uses the returned job
  const postJob = async (jobData) => {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/api/jobs`, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify(jobData),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to post job');
    }

    const newJob = await res.json();
    setJobs(prev => [newJob, ...prev]);
    return newJob;
  };

  return (
    <JobContext.Provider value={{ jobs, postJob }}>
      {children}
    </JobContext.Provider>
  );
};
