package com.jobhub.dto.user;

import java.time.LocalDateTime;
import java.util.List;

import com.jobhub.dto.profile.EducationDTO;
import com.jobhub.dto.profile.ExperienceDTO;
import com.jobhub.entity.User;
import com.jobhub.entity.UserType;

public class UserProfileResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String location;
    private String title;
    private String bio;
    private UserType userType;
    private User.JobSearchStatus jobSearchStatus;
    private String profilePicture;
    private String resumeUrl;
    private Boolean emailVerified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<String> skills;
    private List<ExperienceDTO> experience;
    private List<EducationDTO> education;

    // Constructors
    public UserProfileResponse() {}


    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

     public UserType getUserType() { return userType; }
    public void setUserType(UserType userType) { this.userType = userType; }

    public User.JobSearchStatus getJobSearchStatus() { return jobSearchStatus; }
    public void setJobSearchStatus(User.JobSearchStatus jobSearchStatus) { this.jobSearchStatus = jobSearchStatus; }

    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }

    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }

    public Boolean getEmailVerified() { return emailVerified; }
    public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public List<ExperienceDTO> getExperience() { return experience; }
    public void setExperience(List<ExperienceDTO> experience) { this.experience = experience; }

    public List<EducationDTO> getEducation() { return education; }
    public void setEducation(List<EducationDTO> education) { this.education = education; }
}
