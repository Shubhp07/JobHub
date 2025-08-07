package com.jobhub.dto.job;

import java.math.BigDecimal;

import com.jobhub.entity.Job;

public class JobSearchRequest {
    private String keyword;
    private String location;
    private Job.JobType jobType;
    private Job.ExperienceLevel experienceLevel;
    private BigDecimal minSalary;
    private BigDecimal maxSalary;

    // Constructors
    public JobSearchRequest() {}

    // Getters and Setters
    public String getKeyword() { return keyword; }
    public void setKeyword(String keyword) { this.keyword = keyword; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Job.JobType getJobType() { return jobType; }
    public void setJobType(Job.JobType jobType) { this.jobType = jobType; }

    public Job.ExperienceLevel getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(Job.ExperienceLevel experienceLevel) { this.experienceLevel = experienceLevel; }

    public BigDecimal getMinSalary() { return minSalary; }
    public void setMinSalary(BigDecimal minSalary) { this.minSalary = minSalary; }

    public BigDecimal getMaxSalary() { return maxSalary; }
    public void setMaxSalary(BigDecimal maxSalary) { this.maxSalary = maxSalary; }
}
