package com.jobhub.job;


import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobhub.job.dto.JobCreateRequest;
import com.jobhub.job.dto.JobResponse;
import com.jobhub.job.dto.JobSearchRequest;
import com.jobhub.job.dto.JobUpdateRequest;
import com.jobhub.user.dto.EmployerDashboardStats;
import com.jobhub.job.Job;
import com.jobhub.application.JobApplication;
import com.jobhub.user.User;
import com.jobhub.user.UserType;
import com.jobhub.exception.AccessDeniedException;
import com.jobhub.exception.ResourceNotFoundException;
import com.jobhub.application.JobApplicationRepository;
import com.jobhub.job.JobRepository;
import com.jobhub.user.UserRepository;

@Service
@Transactional
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    public Page<JobResponse> getAllActiveJobs(Pageable pageable) {
        Page<Job> jobs = jobRepository.findByStatus(Job.JobStatus.ACTIVE, pageable);
        return jobs.map(this::convertToResponse);
    }

    public Page<JobResponse> searchJobs(JobSearchRequest request, Pageable pageable) {
        if (request.getKeyword() != null && !request.getKeyword().trim().isEmpty()) {
            return jobRepository.searchActiveJobs(request.getKeyword(), pageable)
                    .map(this::convertToResponse);
        }
        return jobRepository.findJobsWithFilters(
                request.getLocation(),
                request.getJobType(),
                request.getExperienceLevel(),
                request.getMinSalary(),
                request.getMaxSalary(),
                pageable
        ).map(this::convertToResponse);
    }

    public JobResponse getJobById(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));
        return convertToResponse(job);
    }

    public JobResponse createJob(JobCreateRequest request, String employerEmail) {
        User employer = userRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Employer not found"));

        if (employer.getUserType() != UserType.EMPLOYER) {
            throw new AccessDeniedException("Only employers can create job postings");
        }

        var jobExists = jobRepository.findByTitleIgnoreCaseAndLocationIgnoreCaseAndEmployer(
                request.getTitle(), request.getLocation(), employer);

        if (!jobExists.isEmpty()) {
            throw new IllegalArgumentException("Job with the same title and location already exists for this employer");
        }

        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobType());
        job.setExperienceLevel(request.getExperienceLevel());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setCompany(request.getCompany());
        job.setCompanyLogo(request.getCompanyLogo());
        job.setApplicationDeadline(request.getApplicationDeadline());
        job.setEmployer(employer);
        job.setStatus(Job.JobStatus.ACTIVE);
        job.setJobLink(request.getJobLink());
        if (request.getSkills() != null && !request.getSkills().isEmpty()) {
            job.setSkills(String.join(",", request.getSkills()));
        }

        Job savedJob = jobRepository.save(job);
        return convertToResponse(savedJob);
    }

    public JobResponse updateJob(Long jobId, JobUpdateRequest request, String employerEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        User employer = userRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Employer not found"));

        if (!job.getEmployer().getId().equals(employer.getId())) {
            throw new AccessDeniedException("You can only update your own job postings");
        }

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobType());
        job.setExperienceLevel(request.getExperienceLevel());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setCompany(request.getCompany());
        job.setCompanyLogo(request.getCompanyLogo());
        job.setApplicationDeadline(request.getApplicationDeadline());
        job.setJobLink(request.getJobLink());

        Job updatedJob = jobRepository.save(job);
        return convertToResponse(updatedJob);
    }

    public void deleteJob(Long jobId, String employerEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        User employer = userRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Employer not found"));

        if (!job.getEmployer().getId().equals(employer.getId())) {
            throw new AccessDeniedException("You can only delete your own job postings");
        }

        jobRepository.delete(job);
    }

    public JobResponse updateJobStatus(Long jobId, Job.JobStatus status, String employerEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        User employer = userRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Employer not found"));

        if (!job.getEmployer().getId().equals(employer.getId())) {
            throw new AccessDeniedException("You can only update your own job postings");
        }

        job.setStatus(status);
        Job updatedJob = jobRepository.save(job);
        return convertToResponse(updatedJob);
    }

    public Page<JobResponse> getJobsByEmployer(String employerEmail, Pageable pageable) {
        User employer = userRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Employer not found"));

        Page<Job> jobs = jobRepository.findByEmployer(employer, pageable);
        return jobs.map(this::convertToResponse);
    }

    public Page<JobResponse> getJobRecommendations(String userEmail, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Page<Job> jobs = jobRepository.findActiveJobsWithValidDeadline(LocalDateTime.now(), pageable);
        return jobs.map(this::convertToResponse);
    }

    JobResponse convertToResponse(Job job) {
        JobResponse response = new JobResponse();
        response.setId(job.getId());
        response.setTitle(job.getTitle());
        response.setDescription(job.getDescription());
        response.setRequirements(job.getRequirements());
        response.setLocation(job.getLocation());
        response.setJobType(job.getJobType());
        response.setExperienceLevel(job.getExperienceLevel());
        response.setSalaryMin(job.getSalaryMin());
        response.setSalaryMax(job.getSalaryMax());
        response.setCompany(job.getCompany());
        response.setCompanyLogo(job.getCompanyLogo());
        response.setStatus(job.getStatus());
        response.setApplicationDeadline(job.getApplicationDeadline());
        response.setCreatedAt(job.getCreatedAt());
        response.setUpdatedAt(job.getUpdatedAt());
        response.setJobLink(job.getJobLink());

        if (job.getSkills() != null && !job.getSkills().isEmpty()) {
            response.setSkills(Arrays.asList(job.getSkills().split(",")));
        } else {
            response.setSkills(List.of());
        }

        if (job.getEmployer() != null) {
            response.setEmployerId(job.getEmployer().getId());
            response.setEmployerName(job.getEmployer().getFirstName() + " " + job.getEmployer().getLastName());
        }

        long count = jobApplicationRepository.countApplicationsByJob(job);
        response.setApplicationCount((int) count);

        return response;
    }

    public EmployerDashboardStats getEmployerDashboardStats(Long employerId) {
        EmployerDashboardStats stats = new EmployerDashboardStats();

        // 1. Active Jobs
        int activeJobs = jobRepository.countByEmployer_IdAndStatus(employerId, Job.JobStatus.ACTIVE);

        // 2. Total Applications (for all jobs by employer)
        int totalApplications = jobApplicationRepository.countByEmployerId(employerId);

        // 3. Interviews Scheduled
        int interviews = jobApplicationRepository.countInterviewsScheduled(employerId);

        // 4. Hire Rate (ratio of offers made to total applications)
        double hireRate = 0;
        int hiredCount = jobApplicationRepository.countApplicationsByEmployerIdAndStatus(employerId, JobApplication.ApplicationStatus.OFFER);
        if (totalApplications > 0) {
            hireRate = (double) hiredCount / totalApplications * 100;
        }

        stats.setActiveJobs(activeJobs);
        stats.setTotalApplications(totalApplications);
        stats.setInterviewsScheduled(interviews);
        stats.setHireRate(hireRate);

        return stats;
    }
}

