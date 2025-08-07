package com.jobhub.controller;

import com.jobhub.dto.job.JobResponse;
import com.jobhub.service.SavedJobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/saved-jobs")
@Tag(name = "Saved Jobs", description = "Saved jobs management APIs")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('JOBSEEKER')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SavedJobController {

    @Autowired
    private SavedJobService savedJobService;

    @PostMapping("/{jobId}")
    @Operation(summary = "Save a job")
    public ResponseEntity<String> saveJob(
            @PathVariable Long jobId,
            Authentication authentication) throws BadRequestException {
        savedJobService.saveJob(jobId, authentication.getName());
        return ResponseEntity.ok("Job saved successfully");
    }

    @DeleteMapping("/{jobId}")
    @Operation(summary = "Remove saved job")
    public ResponseEntity<String> removeSavedJob(
            @PathVariable Long jobId,
            Authentication authentication) {
        savedJobService.removeSavedJob(jobId, authentication.getName());
        return ResponseEntity.ok("Job removed from saved list");
    }

    @GetMapping
    @Operation(summary = "Get all saved jobs")
    public ResponseEntity<Page<JobResponse>> getSavedJobs(
            Authentication authentication,
            Pageable pageable) {
        Page<JobResponse> response = savedJobService.getSavedJobs(authentication.getName(), pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/check/{jobId}")
    @Operation(summary = "Check if job is saved")
    public ResponseEntity<Boolean> isJobSaved(
            @PathVariable Long jobId,
            Authentication authentication) {
        boolean isSaved = savedJobService.isJobSaved(jobId, authentication.getName());
        return ResponseEntity.ok(isSaved);
    }
}