import React, { createContext, useContext, useState } from 'react';

const JobContext = createContext();

export const useJobContext = () => useContext(JobContext);

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]); // Empty initially or preload with data

  const postJob = (jobData) => {
    const newJob = {
      ...jobData,
      id: Date.now().toString(),
      company: 'Your Company',
      companyLogo: '🏢',
      rating: 4.5,
      employees: '100-500',
      posted: 'Just now'
    };
    setJobs(prev => [newJob, ...prev]);
  };

  return (
    <JobContext.Provider value={{ jobs, postJob }}>
      {children}
    </JobContext.Provider>
  );
};
