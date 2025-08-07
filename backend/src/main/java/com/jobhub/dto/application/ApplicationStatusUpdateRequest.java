package com.jobhub.dto.application;

import java.time.LocalDateTime;

import com.jobhub.entity.JobApplication;

import jakarta.validation.constraints.NotNull;

public class ApplicationStatusUpdateRequest {
     @NotNull(message = "Status is required")
    private JobApplication.ApplicationStatus status;

    private String notes;
    private LocalDateTime interviewDate;

    // Constructors
    public ApplicationStatusUpdateRequest() {}

    public ApplicationStatusUpdateRequest(JobApplication.ApplicationStatus status, String notes, LocalDateTime interviewDate) {
        this.status = status;
        this.notes = notes;
        this.interviewDate = interviewDate;
    }

    // Getters and Setters
    public JobApplication.ApplicationStatus getStatus() { return status; }
    public void setStatus(JobApplication.ApplicationStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getInterviewDate() { return interviewDate; }
    public void setInterviewDate(LocalDateTime interviewDate) { this.interviewDate = interviewDate; }
}
