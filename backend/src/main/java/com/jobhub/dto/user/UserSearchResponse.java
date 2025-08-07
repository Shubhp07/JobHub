package com.jobhub.dto.user;

import com.jobhub.entity.User;

public class UserSearchResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String location;
    private String title;
    private String bio;
    private User.JobSearchStatus jobSearchStatus;
    private String profilePicture;

    // Constructors
    public UserSearchResponse() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public User.JobSearchStatus getJobSearchStatus() { return jobSearchStatus; }
    public void setJobSearchStatus(User.JobSearchStatus jobSearchStatus) { this.jobSearchStatus = jobSearchStatus; }

    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
}