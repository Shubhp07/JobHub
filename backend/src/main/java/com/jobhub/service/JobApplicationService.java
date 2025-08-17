package com.jobhub.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobhub.dto.application.ApplicationCreateRequest;
import com.jobhub.dto.application.ApplicationResponse;
import com.jobhub.dto.application.ApplicationStatusUpdateRequest;
import com.jobhub.entity.Job;
import com.jobhub.entity.JobApplication;
import com.jobhub.entity.User;
import com.jobhub.entity.UserType;
import com.jobhub.exception.AccessDeniedException;
import com.jobhub.exception.BadRequestException;
import com.jobhub.exception.ResourceNotFoundException;
import com.jobhub.repository.JobApplicationRepository;
import com.jobhub.repository.JobRepository;
import com.jobhub.repository.UserRepository;

@Service
@Transactional
public class JobApplicationService {

    @Autowired
    private JobApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    public ApplicationResponse applyForJob(ApplicationCreateRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (applicationRepository.existsByUserAndJob(user, job)) {
            throw new BadRequestException("You have already applied for this job");
        }

        JobApplication application = new JobApplication();
        application.setUser(user);
        application.setJob(job);
        application.setCoverLetter(request.getCoverLetter());
        application.setResumeUrl(request.getResumeUrl());
        application.setStatus(JobApplication.ApplicationStatus.APPLIED);

        JobApplication savedApplication = applicationRepository.save(application);
        return convertToResponse(savedApplication);
    }

    public Page<ApplicationResponse> getUserApplications(String userEmail, JobApplication.ApplicationStatus status, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Page<JobApplication> applications;
        if (status != null) {
            applications = applicationRepository.findByUserAndStatus(user, status, pageable);
        } else {
            applications = applicationRepository.findByUser(user, pageable);
        }

        return applications.map(this::convertToResponse);
    }

    public Page<ApplicationResponse> getJobApplications(Long jobId, JobApplication.ApplicationStatus status, String employerEmail, Pageable pageable) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        User employer = userRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Employer not found"));

        if (!job.getEmployer().getId().equals(employer.getId())) {
            throw new AccessDeniedException("You can only view applications for your own jobs");
        }

        Page<JobApplication> applications;
        if (status != null) {
            // You'll need to add this new method to your repository if it doesn't exist.
            applications = applicationRepository.findByJobAndStatus(job, status, pageable);
        } else {
            applications = applicationRepository.findByJob(job, pageable);
        }

        return applications.map(this::convertToResponse);
    }

    public ApplicationResponse getApplication(Long applicationId, String userEmail) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if user is the applicant or the employer
        if (!application.getUser().getId().equals(user.getId())
                && !application.getJob().getEmployer().getId().equals(user.getId())) {
            throw new AccessDeniedException("You don't have permission to view this application");
        }

        return convertToResponse(application);
    }

    public ApplicationResponse updateApplicationStatus(Long applicationId, ApplicationStatusUpdateRequest request, String employerEmail) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        User employer = userRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Employer not found"));

        if (!application.getJob().getEmployer().getId().equals(employer.getId())) {
            throw new AccessDeniedException("You can only update applications for your own jobs");
        }

        application.setStatus(request.getStatus());
        application.setNotes(request.getNotes());
        application.setInterviewDate(request.getInterviewDate());

        JobApplication updatedApplication = applicationRepository.save(application);
        return convertToResponse(updatedApplication);
    }

    public void withdrawApplication(Long applicationId, String userEmail) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!application.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You can only withdraw your own applications");
        }

        application.setStatus(JobApplication.ApplicationStatus.WITHDRAWN);
        applicationRepository.save(application);
    }

    public Page<ApplicationResponse> getEmployerApplications(String employerEmail, JobApplication.ApplicationStatus status, Pageable pageable) {
        User employer = userRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Employer not found"));

        Page<JobApplication> applications;
        if (status != null) {
            applications = applicationRepository.findApplicationsForEmployerByStatus(employer, status, pageable);
        } else {
            applications = applicationRepository.findApplicationsForEmployer(employer, pageable);
        }

        return applications.map(this::convertToResponse);
    }

    public Object getApplicationStats(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Map<String, Object> stats = new HashMap<>();

        if (user.getUserType() == UserType.JOBSEEKER) {
            long totalApplications = applicationRepository.countApplicationsByUser(user);
            stats.put("totalApplications", totalApplications);
            // Add more job seeker specific stats
        } else if (user.getUserType() == UserType.EMPLOYER) {
            // Add employer specific stats
            stats.put("totalJobsPosted", jobRepository.findByEmployer(user, Pageable.unpaged()).getTotalElements());
        }

        return stats;
    }

    private ApplicationResponse convertToResponse(JobApplication application) {
        ApplicationResponse response = new ApplicationResponse();
        response.setId(application.getId());
        response.setJobId(application.getJob().getId());
        response.setJobTitle(application.getJob().getTitle());
        response.setCompany(application.getJob().getCompany());
        response.setUserId(application.getUser().getId());
        response.setUserName(application.getUser().getFirstName() + " " + application.getUser().getLastName());
        response.setStatus(application.getStatus());
        response.setCoverLetter(application.getCoverLetter());

        // Use application resume if present, otherwise fallback to user's profile resume URL
        String resumeUrl = application.getResumeUrl();
        System.out.println("Application resumeUrl: " + resumeUrl);

        if (resumeUrl == null || resumeUrl.isEmpty()) {
            resumeUrl = application.getUser().getResumeUrl();
            System.out.println("Using profile resumeUrl: " + resumeUrl);
        }

        response.setResumeUrl(resumeUrl);
        response.setResumeUrl(resumeUrl);
        response.setNotes(application.getNotes());
        response.setInterviewDate(application.getInterviewDate());
        response.setAppliedAt(application.getAppliedAt());
        response.setUpdatedAt(application.getUpdatedAt());
        return response;
    }

}
