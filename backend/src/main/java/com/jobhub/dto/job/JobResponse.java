package com.jobhub.dto.job;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.jobhub.entity.Job;

public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private String requirements;
    private String location;
    private Job.JobType jobType;
    private Job.ExperienceLevel experienceLevel;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String company;
    private String companyLogo;
    private Job.JobStatus status;
    private LocalDateTime applicationDeadline;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long employerId;
    private String employerName;
    private String jobLink;
    private int applicationCount; 

    public int getApplicationCount() {
        return applicationCount;
    }

    public void setApplicationCount(int applicationCount) {
        this.applicationCount = applicationCount;
    }

    // Constructors
    public JobResponse() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRequirements() { return requirements; }
    public void setRequirements(String requirements) { this.requirements = requirements; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Job.JobType getJobType() { return jobType; }
    public void setJobType(Job.JobType jobType) { this.jobType = jobType; }

    public Job.ExperienceLevel getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(Job.ExperienceLevel experienceLevel) { this.experienceLevel = experienceLevel; }

    public BigDecimal getSalaryMin() { return salaryMin; }
    public void setSalaryMin(BigDecimal salaryMin) { this.salaryMin = salaryMin; }

    public BigDecimal getSalaryMax() { return salaryMax; }
    public void setSalaryMax(BigDecimal salaryMax) { this.salaryMax = salaryMax; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getCompanyLogo() { return companyLogo; }
    public void setCompanyLogo(String companyLogo) { this.companyLogo = companyLogo; }

    public Job.JobStatus getStatus() { return status; }
    public void setStatus(Job.JobStatus status) { this.status = status; }

    public LocalDateTime getApplicationDeadline() { return applicationDeadline; }
    public void setApplicationDeadline(LocalDateTime applicationDeadline) { this.applicationDeadline = applicationDeadline; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getEmployerId() { return employerId; }
    public void setEmployerId(Long employerId) { this.employerId = employerId; }

    public String getEmployerName() { return employerName; }
    public void setEmployerName(String employerName) { this.employerName = employerName; }

    public String getJobLink() {
        return jobLink;
    }

    public void setJobLink(String jobLink) {
        this.jobLink = jobLink;
    }
}
