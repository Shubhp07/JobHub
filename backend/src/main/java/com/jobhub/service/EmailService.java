package com.jobhub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@jobhub.com}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Async
    public void sendVerificationEmail(String toEmail, String verificationToken) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("JobHub - Verify Your Email Address");
            
            String verificationUrl = frontendUrl + "/verify-email?token=" + verificationToken;
            String emailBody = "Welcome to JobHub!\n\n" +
                    "Please click the link below to verify your email address:\n" +
                    verificationUrl + "\n\n" +
                    "This link will expire in 24 hours.\n\n" +
                    "If you didn't create an account with JobHub, please ignore this email.\n\n" +
                    "Best regards,\n" +
                    "The JobHub Team";
            
            message.setText(emailBody);
            mailSender.send(message);
            
            System.out.println("Verification email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send verification email to " + toEmail + ": " + e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("JobHub - Password Reset Request");
            
            String resetUrl = frontendUrl + "/reset-password?token=" + resetToken;
            String emailBody = "Hello,\n\n" +
                    "You have requested to reset your password for your JobHub account.\n\n" +
                    "Please click the link below to reset your password:\n" +
                    resetUrl + "\n\n" +
                    "This link will expire in 1 hour.\n\n" +
                    "If you didn't request a password reset, please ignore this email.\n\n" +
                    "Best regards,\n" +
                    "The JobHub Team";
            
            message.setText(emailBody);
            mailSender.send(message);
            
            System.out.println("Password reset email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send password reset email to " + toEmail + ": " + e.getMessage());
        }
    }

    @Async
    public void sendWelcomeEmail(String toEmail, String userName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Welcome to JobHub!");
            
            String emailBody = "Hello " + userName + ",\n\n" +
                    "Welcome to JobHub! We're excited to have you join our community.\n\n" +
                    "Here's what you can do next:\n" +
                    "• Complete your profile to attract employers\n" +
                    "• Upload your resume\n" +
                    "• Start browsing job opportunities\n" +
                    "• Set up job alerts for your preferences\n\n" +
                    "Visit your dashboard: " + frontendUrl + "/dashboard\n\n" +
                    "If you have any questions, feel free to contact our support team.\n\n" +
                    "Best regards,\n" +
                    "The JobHub Team";
            
            message.setText(emailBody);
            mailSender.send(message);
            
            System.out.println("Welcome email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send welcome email to " + toEmail + ": " + e.getMessage());
        }
    }

    @Async
    public void sendJobApplicationNotification(String employerEmail, String jobTitle, String applicantName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(employerEmail);
            message.setSubject("New Job Application - " + jobTitle);
            
            String emailBody = "Hello,\n\n" +
                    "You have received a new application for your job posting:\n\n" +
                    "Job Title: " + jobTitle + "\n" +
                    "Applicant: " + applicantName + "\n\n" +
                    "Please log in to your JobHub dashboard to review the application:\n" +
                    frontendUrl + "/dashboard/applications\n\n" +
                    "Best regards,\n" +
                    "The JobHub Team";
            
            message.setText(emailBody);
            mailSender.send(message);
            
            System.out.println("Job application notification sent to: " + employerEmail);
        } catch (Exception e) {
            System.err.println("Failed to send job application notification to " + employerEmail + ": " + e.getMessage());
        }
    }

    @Async
    public void sendApplicationStatusUpdate(String applicantEmail, String jobTitle, String status) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(applicantEmail);
            message.setSubject("Application Status Update - " + jobTitle);
            
            String emailBody = "Hello,\n\n" +
                    "Your application status has been updated:\n\n" +
                    "Job Title: " + jobTitle + "\n" +
                    "Status: " + status + "\n\n" +
                    "Please log in to your JobHub dashboard for more details:\n" +
                    frontendUrl + "/dashboard/applications\n\n" +
                    "Best regards,\n" +
                    "The JobHub Team";
            
            message.setText(emailBody);
            mailSender.send(message);
            
            System.out.println("Application status update sent to: " + applicantEmail);
        } catch (Exception e) {
            System.err.println("Failed to send application status update to " + applicantEmail + ": " + e.getMessage());
        }
    }
}
