package com.jobhub.dto.auth;

public class RegisterResponse {
    private Long userId;
    private String email;
    private String message;

    // Constructors
    public RegisterResponse() {}

    public RegisterResponse(Long userId, String email, String message) {
        this.userId = userId;
        this.email = email;
        this.message = message;
    }

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}