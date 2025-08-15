package com.jobhub.dto.application;

import java.time.LocalDateTime;

import com.jobhub.entity.JobApplication;

public class ApplicationResponse {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String company;
    private Long userId;
    private String userName;
    private JobApplication.ApplicationStatus status;
    private String coverLetter;
    private String resumeUrl;
    private String notes;
    private LocalDateTime interviewDate;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
    private String applicantResumeUrl;

    // Constructors
    public ApplicationResponse() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public JobApplication.ApplicationStatus getStatus() { return status; }
    public void setStatus(JobApplication.ApplicationStatus status) { this.status = status; }

    public String getCoverLetter() { return coverLetter; }
    public void setCoverLetter(String coverLetter) { this.coverLetter = coverLetter; }

    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getInterviewDate() { return interviewDate; }
    public void setInterviewDate(LocalDateTime interviewDate) { this.interviewDate = interviewDate; }

    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getApplicantResumeUrl() {
        return applicantResumeUrl;
    }

    public void setApplicantResumeUrl(String applicantResumeUrl) {
        this.applicantResumeUrl = applicantResumeUrl;
    }
}
