package com.jobhub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jobhub.dto.application.ApplicationCreateRequest;
import com.jobhub.dto.application.ApplicationResponse;
import com.jobhub.dto.application.ApplicationStatusUpdateRequest;
import com.jobhub.entity.JobApplication;
import com.jobhub.service.JobApplicationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/applications")
@Tag(name = "Job Applications", description = "Job application management APIs")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class JobApplicationController {

    @Autowired
    private JobApplicationService applicationService;

    @PostMapping
    @Operation(summary = "Apply for a job")
    @PreAuthorize("hasRole('JOBSEEKER')")
    public ResponseEntity<ApplicationResponse> applyForJob(
            @Valid @RequestBody ApplicationCreateRequest request,
            Authentication authentication) {
        ApplicationResponse response = applicationService.applyForJob(request, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-applications")
    @Operation(summary = "Get current user's applications")
    @PreAuthorize("hasRole('JOBSEEKER')")
    public ResponseEntity<Page<ApplicationResponse>> getMyApplications(
            @RequestParam(required = false) JobApplication.ApplicationStatus status,
            Authentication authentication,
            Pageable pageable) {
        Page<ApplicationResponse> response = applicationService.getUserApplications(
                authentication.getName(), status, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/job/{jobId}")
    @Operation(summary = "Get applications for a specific job")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<Page<ApplicationResponse>> getJobApplications(
            @PathVariable Long jobId,
            @RequestParam(required = false) JobApplication.ApplicationStatus status,
            Authentication authentication,
            Pageable pageable) {
        Page<ApplicationResponse> response = applicationService.getJobApplications(
                jobId, status, authentication.getName(), pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{applicationId}")
    @Operation(summary = "Get application details")
    public ResponseEntity<ApplicationResponse> getApplication(
            @PathVariable Long applicationId,
            Authentication authentication) {
        ApplicationResponse response = applicationService.getApplication(applicationId, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{applicationId}/status")
    @Operation(summary = "Update application status")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<ApplicationResponse> updateApplicationStatus(
            @PathVariable Long applicationId,
            @Valid @RequestBody ApplicationStatusUpdateRequest request,
            Authentication authentication) {
        ApplicationResponse response = applicationService.updateApplicationStatus(
                applicationId, request, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{applicationId}")
    @Operation(summary = "Withdraw application")
    @PreAuthorize("hasRole('JOBSEEKER')")
    public ResponseEntity<String> withdrawApplication(
            @PathVariable Long applicationId,
            Authentication authentication) {
        applicationService.withdrawApplication(applicationId, authentication.getName());
        return ResponseEntity.ok("Application withdrawn successfully");
    }

    @GetMapping("/employer/all")
    @Operation(summary = "Get all applications for employer's jobs")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<Page<ApplicationResponse>> getEmployerApplications(
            @RequestParam(required = false) JobApplication.ApplicationStatus status,
            Authentication authentication,
            Pageable pageable) {
        Page<ApplicationResponse> response = applicationService.getEmployerApplications(
                authentication.getName(), status, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    @Operation(summary = "Get application statistics")
    public ResponseEntity<?> getApplicationStats(Authentication authentication) {
        Object stats = applicationService.getApplicationStats(authentication.getName());
        return ResponseEntity.ok(stats);
    }
}