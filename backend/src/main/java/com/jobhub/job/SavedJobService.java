package com.jobhub.job;


import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobhub.job.dto.JobResponse;
import com.jobhub.job.Job;
import com.jobhub.job.SavedJob;
import com.jobhub.user.User;
import com.jobhub.exception.ResourceNotFoundException;
import com.jobhub.job.JobRepository;
import com.jobhub.job.SavedJobRepository;
import com.jobhub.user.UserRepository;

@Service
@Transactional
public class SavedJobService {
    @Autowired
    private SavedJobRepository savedJobRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobService jobService;

    public void saveJob(Long jobId, String userEmail) throws BadRequestException {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (savedJobRepository.existsByUserAndJob(user, job)) {
            throw new BadRequestException("Job is already saved");
        }

        SavedJob savedJob = new SavedJob();
        savedJob.setUser(user);
        savedJob.setJob(job);
        savedJobRepository.save(savedJob);
    }

    public void removeSavedJob(Long jobId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        savedJobRepository.deleteByUserAndJob(user, job);
    }

    public Page<JobResponse> getSavedJobs(String userEmail, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Page<SavedJob> savedJobs = savedJobRepository.findByUser(user, pageable);
        return savedJobs.map(savedJob -> jobService.convertToResponse(savedJob.getJob()));
    }

    public boolean isJobSaved(Long jobId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        return savedJobRepository.existsByUserAndJob(user, job);
    }
}

