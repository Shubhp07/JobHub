package com.jobhub.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jobhub.dto.applicant.ApplicantDto;
import com.jobhub.entity.JobApplication;
import com.jobhub.entity.User;
import com.jobhub.repository.JobApplicationRepository;
import com.jobhub.repository.UserRepository;

@Service
public class ApplicationService {

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ApplicantDto> getApplicantsForJob(Long jobId) {
        // Fetch all job applications for the given jobId
        List<JobApplication> applications = jobApplicationRepository.findByJobId(jobId);

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
                dto.setUserName(user.getName());
                dto.setUserEmail(user.getEmail());
                // Assuming User entity has getResumeUrl() method returning the resume's URL
                dto.setResumeUrl(user.getResumeUrl());
                applicants.add(dto);
            }
        }
        return applicants;
    }
}
