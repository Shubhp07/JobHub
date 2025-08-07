package com.jobhub.dto.user;

import java.util.List;

import com.jobhub.dto.profile.EducationDTO;
import com.jobhub.dto.profile.ExperienceDTO;
import com.jobhub.entity.User;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public class UserProfileRequest {

    @Size(max = 50, message = "First name must not exceed 50 characters")
    private String firstName;

    @Size(max = 50, message = "Last name must not exceed 50 characters")
    private String lastName;

    @Email(message = "Email should be valid")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    @Size(max = 20, message = "Phone must not exceed 20 characters")
    private String phone;

    @Size(max = 100, message = "Location must not exceed 100 characters")
    private String location;

    @Size(max = 100, message = "Title must not exceed 100 characters")
    private String title;

    private String bio;

    private User.JobSearchStatus jobSearchStatus;

    private List<String> skills;           // Use List<String> or your custom Skill DTO
    private List<ExperienceDTO> experience; // Define ExperienceDTO class
    private List<EducationDTO> education;

    // Constructors
    public UserProfileRequest() {
    }

    // Getters and SettersS
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public User.JobSearchStatus getJobSearchStatus() {
        return jobSearchStatus;
    }

    public void setJobSearchStatus(User.JobSearchStatus jobSearchStatus) {
        this.jobSearchStatus = jobSearchStatus;
    }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public List<ExperienceDTO> getExperience() { return experience; }
    public void setExperience(List<ExperienceDTO> experience) { this.experience = experience; }

    public List<EducationDTO> getEducation() { return education; }
    public void setEducation(List<EducationDTO> education) { this.education = education; }
}
