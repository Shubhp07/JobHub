package com.jobhub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jobhub.dto.job.JobCreateRequest;
import com.jobhub.dto.job.JobResponse;
import com.jobhub.dto.job.JobSearchRequest;
import com.jobhub.dto.job.JobUpdateRequest;
import com.jobhub.entity.Job;
import com.jobhub.service.JobService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/jobs")
@Tag(name = "Job Management", description = "Job posting and search APIs")
@CrossOrigin(origins = "*", maxAge = 3600)
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping
    @Operation(summary = "Get all active jobs")
    public ResponseEntity<Page<JobResponse>> getAllJobs(
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<JobResponse> response = jobService.getAllActiveJobs(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    @Operation(summary = "Search jobs with filters")
    public ResponseEntity<Page<JobResponse>> searchJobs(
            @Valid @ModelAttribute JobSearchRequest request,
            Pageable pageable) {
        Page<JobResponse> response = jobService.searchJobs(request, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{jobId}")
    @Operation(summary = "Get job by ID")
    public ResponseEntity<JobResponse> getJobById(@PathVariable Long jobId) {
        JobResponse response = jobService.getJobById(jobId);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @Operation(summary = "Create new job posting")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<JobResponse> createJob(
            @Valid @RequestBody JobCreateRequest request,
            Authentication authentication) {
        JobResponse response = jobService.createJob(request, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{jobId}")
    @Operation(summary = "Update job posting")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<JobResponse> updateJob(
            @PathVariable Long jobId,
            @Valid @RequestBody JobUpdateRequest request,
            Authentication authentication) {
        JobResponse response = jobService.updateJob(jobId, request, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{jobId}")
    @Operation(summary = "Delete job posting")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<String> deleteJob(
            @PathVariable Long jobId,
            Authentication authentication) {
        jobService.deleteJob(jobId, authentication.getName());
        return ResponseEntity.ok("Job deleted successfully");
    }

    @PutMapping("/{jobId}/status")
    @Operation(summary = "Update job status")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<JobResponse> updateJobStatus(
            @PathVariable Long jobId,
            @RequestParam Job.JobStatus status,
            Authentication authentication) {
        JobResponse response = jobService.updateJobStatus(jobId, status, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-jobs")
    @Operation(summary = "Get jobs posted by current employer")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<Page<JobResponse>> getMyJobs(
            Authentication authentication,
            // Add this @PageableDefault annotation for consistent sorting
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<JobResponse> response = jobService.getJobsByEmployer(authentication.getName(), pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/recommendations")
    @Operation(summary = "Get job recommendations for current user")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Page<JobResponse>> getJobRecommendations(
            Authentication authentication,
            Pageable pageable) {
        Page<JobResponse> response = jobService.getJobRecommendations(authentication.getName(), pageable);
        return ResponseEntity.ok(response);
    }
}
