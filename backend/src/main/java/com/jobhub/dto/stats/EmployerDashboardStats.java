package com.jobhub.dto.stats;

public class EmployerDashboardStats {
    private int activeJobs;
    private int totalApplications;
    private int interviewsScheduled;
    private double hireRate;

    public int getActiveJobs() {
        return activeJobs;
    }

    public void setActiveJobs(int activeJobs) {
        this.activeJobs = activeJobs;
    }

    public int getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(int totalApplications) {
        this.totalApplications = totalApplications;
    }

    public int getInterviewsScheduled() {
        return interviewsScheduled;
    }

    public void setInterviewsScheduled(int interviewsScheduled) {
        this.interviewsScheduled = interviewsScheduled;
    }

    public double getHireRate() {
        return hireRate;
    }

    public void setHireRate(double hireRate) {
        this.hireRate = hireRate;
    }
}
