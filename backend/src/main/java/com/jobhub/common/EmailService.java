package com.jobhub.common;

import java.io.FileWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@jobhub.com}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    private final Path devMailDir = Paths.get("..", "emails").toAbsolutePath().normalize();

    private void ensureDevMailDir() {
        try {
            if (!Files.exists(devMailDir)) {
                Files.createDirectories(devMailDir);
            }
        } catch (Exception ex) {
            logger.warn("Unable to create dev emails directory {}: {}", devMailDir, ex.getMessage());
        }
    }

    private void writeEmailToDisk(String toEmail, String subject, String body) {
        try {
            ensureDevMailDir();
            String fileName = Instant.now().toEpochMilli() + "_" + toEmail.replaceAll("[^a-zA-Z0-9@.-]", "_") + ".txt";
            Path out = devMailDir.resolve(fileName);
            try (FileWriter fw = new FileWriter(out.toFile())) {
                fw.write("To: " + toEmail + "\n");
                fw.write("Subject: " + subject + "\n\n");
                fw.write(body);
            }
            logger.info("Wrote email to disk for dev inspection: {}", out.toString());
        } catch (Exception ex) {
            logger.error("Failed to write email to disk: {}", ex.getMessage());
        }
    }

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
                    "This link will expire in 15 minutes.\n\n" +
                    "If you didn't create an account with JobHub, please ignore this email.\n\n" +
                    "Best regards,\n" +
                    "The JobHub Team";
            
        String subject = "JobHub - Verify Your Email Address";
        String verificationUrl = frontendUrl + "/verify-email?token=" + verificationToken;
        String emailBody = "Welcome to JobHub!\n\n" +
                "Please click the link below to verify your email address:\n" +
                verificationUrl + "\n\n" +
                "This link will expire in 24 hours.\n\n" +
                "If you didn't create an account with JobHub, please ignore this email.\n\n" +
                "Best regards,\n" +
                "The JobHub Team";

        if (mailSender == null || fromEmail == null || fromEmail.contains("your_email") || fromEmail.contains("noreply@jobhub.com")) {
            logger.warn("SMTP not configured or using placeholder 'from' address - falling back to writing email to disk for {}", toEmail);
            writeEmailToDisk(toEmail, subject, emailBody);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(emailBody);
            mailSender.send(message);
            logger.info("Verification email sent to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send verification email to {}: {}", toEmail, e.getMessage(), e);
            // fallback for dev: write to disk so user can still verify manually
            writeEmailToDisk(toEmail, subject, emailBody + "\n\n[ERROR] " + e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        String subject = "JobHub - Password Reset Request";
        String resetUrl = frontendUrl + "/reset-password?token=" + resetToken;
        String emailBody = "Hello,\n\n" +
                "You have requested to reset your password for your JobHub account.\n\n" +
                "Please click the link below to reset your password:\n" +
                resetUrl + "\n\n" +
                "This link will expire in 1 hour.\n\n" +
                "If you didn't request a password reset, please ignore this email.\n\n" +
                "Best regards,\n" +
                "The JobHub Team";

        if (mailSender == null || fromEmail == null || fromEmail.contains("your_email") || fromEmail.contains("noreply@jobhub.com")) {
            logger.warn("SMTP not configured or using placeholder 'from' address - writing password reset email to disk for {}", toEmail);
            writeEmailToDisk(toEmail, subject, emailBody);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(emailBody);
            mailSender.send(message);
            logger.info("Password reset email sent to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send password reset email to {}: {}", toEmail, e.getMessage(), e);
            writeEmailToDisk(toEmail, subject, emailBody + "\n\n[ERROR] " + e.getMessage());
        }
    }

    @Async
    public void sendWelcomeEmail(String toEmail, String userName) {
        String subject = "Welcome to JobHub!";
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

        if (mailSender == null || fromEmail == null || fromEmail.contains("your_email") || fromEmail.contains("noreply@jobhub.com")) {
            logger.warn("SMTP not configured - writing welcome email to disk for {}", toEmail);
            writeEmailToDisk(toEmail, subject, emailBody);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(emailBody);
            mailSender.send(message);
            logger.info("Welcome email sent to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send welcome email to {}: {}", toEmail, e.getMessage(), e);
            writeEmailToDisk(toEmail, subject, emailBody + "\n\n[ERROR] " + e.getMessage());
        }
    }

    @Async
    public void sendJobApplicationNotification(String employerEmail, String jobTitle, String applicantName) {
        String subject = "New Job Application - " + jobTitle;
        String emailBody = "Hello,\n\n" +
                "You have received a new application for your job posting:\n\n" +
                "Job Title: " + jobTitle + "\n" +
                "Applicant: " + applicantName + "\n\n" +
                "Please log in to your JobHub dashboard to review the application:\n" +
                frontendUrl + "/dashboard/applications\n\n" +
                "Best regards,\n" +
                "The JobHub Team";

        if (mailSender == null || fromEmail == null || fromEmail.contains("your_email") || fromEmail.contains("noreply@jobhub.com")) {
            logger.warn("SMTP not configured - writing job application notification to disk for {}", employerEmail);
            writeEmailToDisk(employerEmail, subject, emailBody);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(employerEmail);
            message.setSubject(subject);
            message.setText(emailBody);
            mailSender.send(message);
            logger.info("Job application notification sent to: {}", employerEmail);
        } catch (Exception e) {
            logger.error("Failed to send job application notification to {}: {}", employerEmail, e.getMessage(), e);
            writeEmailToDisk(employerEmail, subject, emailBody + "\n\n[ERROR] " + e.getMessage());
        }
    }

    @Async
    public void sendApplicationStatusUpdate(String applicantEmail, String jobTitle, String status) {
        String subject = "Application Status Update - " + jobTitle;
        String emailBody = "Hello,\n\n" +
                "Your application status has been updated:\n\n" +
                "Job Title: " + jobTitle + "\n" +
                "Status: " + status + "\n\n" +
                "Please log in to your JobHub dashboard for more details:\n" +
                frontendUrl + "/dashboard/applications\n\n" +
                "Best regards,\n" +
                "The JobHub Team";

        if (mailSender == null || fromEmail == null || fromEmail.contains("your_email") || fromEmail.contains("noreply@jobhub.com")) {
            logger.warn("SMTP not configured - writing application status update to disk for {}", applicantEmail);
            writeEmailToDisk(applicantEmail, subject, emailBody);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(applicantEmail);
            message.setSubject(subject);
            message.setText(emailBody);
            mailSender.send(message);
            logger.info("Application status update sent to: {}", applicantEmail);
        } catch (Exception e) {
            logger.error("Failed to send application status update to {}: {}", applicantEmail, e.getMessage(), e);
            writeEmailToDisk(applicantEmail, subject, emailBody + "\n\n[ERROR] " + e.getMessage());
        }
    }
}
