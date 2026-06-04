package com.jobhub.application;

import com.jobhub.job.Job;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jobhub.application.dto.ApplicantDto;
import com.jobhub.application.JobApplication;
import com.jobhub.user.User;
import com.jobhub.application.JobApplicationRepository;
import com.jobhub.user.UserRepository;

@Service
public class ApplicationService {

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ApplicantDto> getApplicantsForJob(Long jobId) {
        // Fetch all job applications for the given jobId using the correct repository method
        List<JobApplication> applications = jobApplicationRepository.findByJob_Id(jobId);

        List<ApplicantDto> applicants = new ArrayList<>();
        for (JobApplication app : applications) {
            // Fetch the user associated with the application
            User user = userRepository.findById(app.getUser().getId()).orElse(null);
            if (user != null) {
                ApplicantDto dto = new ApplicantDto();
                dto.setId(app.getId());
                dto.setJobId(jobId);
                dto.setJobTitle(app.getJob().getTitle());
                dto.setCompany(app.getJob().getCompany());
                dto.setUserId(user.getId());
                dto.setUserName(user.getName()); // Ensure User class has getName() method
                dto.setUserEmail(user.getEmail());
                // Assuming User entity has getResumeUrl() method returning the resume's URL
                dto.setResumeUrl(user.getResumeUrl());
                applicants.add(dto);
            }
        }
        return applicants;
    }
}

