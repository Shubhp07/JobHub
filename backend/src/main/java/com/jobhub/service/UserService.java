package com.jobhub.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.jobhub.dto.profile.EducationDTO;
import com.jobhub.dto.profile.ExperienceDTO;
import com.jobhub.dto.user.UserProfileRequest;
import com.jobhub.dto.user.UserProfileResponse;
import com.jobhub.dto.user.UserSearchResponse;
import com.jobhub.entity.Education;
import com.jobhub.entity.Experience;
import com.jobhub.entity.User;
import com.jobhub.entity.UserSkill;
import com.jobhub.entity.UserType;
import com.jobhub.exception.ResourceNotFoundException;
import com.jobhub.repository.UserRepository;


@Service
@Transactional
public class UserService {

    

    @Autowired
    private UserRepository userRepository;

    // ---------- LOAD PROFILE -----------
    public UserProfileResponse getCurrentUserProfile(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return convertToProfileResponse(user);
    }

    // ---------- UPDATE PROFILE -----------
    public UserProfileResponse updateProfile(String userEmail, UserProfileRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getLocation() != null) {
            user.setLocation(request.getLocation());
        }
        if (request.getTitle() != null) {
            user.setTitle(request.getTitle());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getJobSearchStatus() != null) {
            user.setJobSearchStatus(request.getJobSearchStatus());
        }

        // ---------- SKILLS ----------
        if (request.getSkills() != null) {
            user.getSkills().clear();
            for (String skillName : request.getSkills()) {
                UserSkill userSkill = new UserSkill();
                userSkill.setSkillName(skillName);
                userSkill.setUser(user);
                user.getSkills().add(userSkill);
            }
        }

        DateTimeFormatter yearMonthFormatter = DateTimeFormatter.ofPattern("yyyy-MM");

        // ---------- EXPERIENCE ----------
        if (request.getExperience() != null) {
            user.getExperiences().clear();
            for (ExperienceDTO dto : request.getExperience()) {
                Experience e = new Experience();
                e.setCompany(dto.getCompany());
                e.setRole(dto.getRole());
                e.setTitle(dto.getTitle());

                e.setStartDate(parseYearMonthToLocalDate(dto.getStartDate(), yearMonthFormatter));
                e.setEndDate(parseYearMonthToLocalDate(dto.getEndDate(), yearMonthFormatter));

                e.setDescription(dto.getDescription());
                e.setUser(user);
                user.getExperiences().add(e);
            }
        }

        // ---------- EDUCATION ----------
        if (request.getEducation() != null) {
            user.getEducations().clear();
            for (EducationDTO dto : request.getEducation()) {
                Education edu = new Education();
                edu.setSchool(dto.getSchool());
                edu.setDegree(dto.getDegree());
                edu.setFieldOfStudy(dto.getFieldOfStudy());

                edu.setStartDate(parseYearMonthToLocalDate(dto.getStartDate(), yearMonthFormatter));
                edu.setEndDate(parseYearMonthToLocalDate(dto.getEndDate(), yearMonthFormatter));

                edu.setUser(user);
                user.getEducations().add(edu);
            }
        }

        User updatedUser = userRepository.save(user);
        return convertToProfileResponse(updatedUser);
    }

// Helper method for parsing "yyyy-MM" string to LocalDate (first day of month) or null if invalid
    private LocalDate parseYearMonthToLocalDate(String yearMonthStr, DateTimeFormatter formatter) {
        if (yearMonthStr != null && !yearMonthStr.isEmpty()) {
            try {
                YearMonth ym = YearMonth.parse(yearMonthStr, formatter);
                return ym.atDay(1);  // first day of the month
            } catch (Exception e) {
                // optionally log the parse error and return null or throw a custom exception
                return null;
            }
        }
        return null;
    }

    // ---------- PROFILE PICTURE UPLOAD ----------
    public String uploadProfilePicture(String userEmail, MultipartFile file) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String imageUrl = "/uploads/profiles/" + user.getId() + "_" + file.getOriginalFilename();
        user.setProfilePicture(imageUrl);
        userRepository.save(user);

        // Upload to S3 or local if you choose
        // (Implementation omitted for brevity)
        return imageUrl;
    }

    // ---------- RESUME UPLOAD ----------
    public String uploadResume(String userEmail, MultipartFile file) {
    User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

    // Local upload directory
    String uploadDir = "D:\\Project\\Resume";

    // Ensure directory exists
    Path uploadPath = Paths.get(uploadDir);
    if (!Files.exists(uploadPath)) {
        try {
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory: " + uploadDir, e);
        }
    }

    // Validate original filename and sanitize it for safe URLs and file system usage
    String originalFilename = file.getOriginalFilename();
    if (originalFilename == null || originalFilename.trim().isEmpty()) {
        throw new RuntimeException("File must have a valid original filename");
    }
    // Replace special characters with underscore, allow alphanumeric, dot, dash, underscore
    String safeFilename = originalFilename.replaceAll("[^a-zA-Z0-9.\\-_]", "_");

    // Generate unique filename
    String filename = user.getId() + "_" + System.currentTimeMillis() + "_" + safeFilename;
    Path filePath = uploadPath.resolve(filename);

    try (InputStream inputStream = file.getInputStream()) {
        Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
    } catch (IOException e) {
        throw new RuntimeException("Failed to store file locally: " + filename, e);
    }

    // Store the relative URL pointing to the controller endpoint that serves resumes
    String resumeUrl = "/api/resumes/" + filename;
    user.setResumeUrl(resumeUrl);
    userRepository.save(user);

    return resumeUrl; // Return the relative downloadable URL
}


    
    // ---------- SEARCH ----------
    public Page<UserSearchResponse> searchJobSeekers(String keyword, String location, String skills, Pageable pageable) {
        Page<User> users;
        if (keyword != null && !keyword.trim().isEmpty()) {
            users = userRepository.searchJobSeekers(keyword, pageable);
        } else {
            users = userRepository.findActiveUsersByType(UserType.JOBSEEKER, pageable);
        }
        return users.map(this::convertToSearchResponse);
    }

    // ---------- OTHER METHODS ----------
    public UserProfileResponse getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return convertToProfileResponse(user);
    }

    public void deleteAccount(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setIsActive(false);
        userRepository.save(user);
    }

    // ---------- MAP ENTITY -> DTO ----------
    private UserProfileResponse convertToProfileResponse(User user) {
        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setLocation(user.getLocation());
        response.setTitle(user.getTitle());
        response.setBio(user.getBio());
        response.setUserType(user.getUserType());
        response.setJobSearchStatus(user.getJobSearchStatus());
        response.setProfilePicture(user.getProfilePicture());
        response.setResumeUrl(user.getResumeUrl());
        response.setEmailVerified(user.getEmailVerified());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());

        // SKILLS
        response.setSkills(
                user.getSkills().stream()
                        .map(UserSkill::getSkillName)
                        .collect(Collectors.toList())
        );
        // EXPERIENCE
        response.setExperience(
                user.getExperiences().stream().map(exp -> {
                    ExperienceDTO dto = new ExperienceDTO();
                    dto.setCompany(exp.getCompany());
                    dto.setRole(exp.getRole());
                    dto.setStartDate(exp.getStartDate() != null ? exp.getStartDate().toString() : null);
                    dto.setEndDate(exp.getEndDate() != null ? exp.getEndDate().toString() : null);

                    dto.setDescription(exp.getDescription());
                    return dto;
                }).collect(Collectors.toList())
        );
        // EDUCATION
        response.setEducation(
                user.getEducations().stream().map(edu -> {
                    EducationDTO dto = new EducationDTO();
                    dto.setSchool(edu.getSchool());
                    dto.setDegree(edu.getDegree());
                    dto.setFieldOfStudy(edu.getFieldOfStudy());
                    dto.setStartDate(edu.getStartDate() != null ? edu.getStartDate().toString() : null);
                    dto.setEndDate(edu.getEndDate() != null ? edu.getEndDate().toString() : null);
                    return dto;
                }).collect(Collectors.toList())
        );

        return response;
    }

    // ---------- MAP ENTITY -> SEARCH RESPONSE -----------
    private UserSearchResponse convertToSearchResponse(User user) {
        UserSearchResponse response = new UserSearchResponse();
        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setLocation(user.getLocation());
        response.setTitle(user.getTitle());
        response.setBio(user.getBio());
        response.setJobSearchStatus(user.getJobSearchStatus());
        response.setProfilePicture(user.getProfilePicture());
        return response;
    }
}
