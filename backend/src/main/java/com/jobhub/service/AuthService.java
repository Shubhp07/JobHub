package com.jobhub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jobhub.dto.auth.LoginRequest;
import com.jobhub.dto.auth.LoginResponse;
import com.jobhub.dto.auth.RegisterRequest;
import com.jobhub.dto.auth.RegisterResponse;
import com.jobhub.entity.User;
import com.jobhub.exception.BadRequestException;
import com.jobhub.exception.ResourceNotFoundException;
import com.jobhub.repository.UserRepository;
import com.jobhub.security.jwt.JwtHelper;

@Service
@Transactional
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtHelper tokenProvider;

    @Autowired
    private EmailService emailService;

    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUserType(request.getUserType());
        user.setEmailVerified(false);
        user.setIsActive(true);
        user.setEnabled(true);


        User savedUser = userRepository.save(user);

        // Send verification email with error handling
        try {
            String verificationToken = tokenProvider.generateEmailVerificationToken(savedUser.getEmail());
            emailService.sendVerificationEmail(savedUser.getEmail(), verificationToken);
            System.out.println("Verification email sent to " + savedUser.getEmail());
        } catch (Exception e) {
            System.err.println("Failed to send verification email: " + e.getMessage());
            e.printStackTrace();
        }

        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getEmail(),
                "Registration successful. Please check your email for verification."
        );
    }

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.getEmailVerified()) {
            throw new BadRequestException("Please verify your email before logging in");
        }

        String token = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);

        System.out.println("AccessToken: " + token);
        System.out.println("RefreshToken: " + refreshToken);

        return new LoginResponse(
                token,
                refreshToken,
                "Bearer",
                user.getId(),
                user.getEmail(),
                user.getFirstName() + " " + user.getLastName(),
                user.getUserType().toString()
        );
    }

    public void logout(String token) {
        // Add token to blacklist (implement token blacklisting if needed)
        // For now, we'll just validate the token
        tokenProvider.validateToken(token.substring(7)); // Remove "Bearer " prefix
    }

    public LoginResponse refreshToken(String token) {
        String refreshToken = token.substring(7); // Remove "Bearer " prefix

        if (!tokenProvider.validateToken(refreshToken)) {
            throw new BadRequestException("Invalid refresh token");
        }

        String email = tokenProvider.getUsernameFromToken(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user, null, user.getAuthorities()
        );

        String newToken = tokenProvider.generateToken(authentication);
        String newRefreshToken = tokenProvider.generateRefreshToken(authentication);

        return new LoginResponse(
                newToken,
                newRefreshToken,
                "Bearer",
                user.getId(),
                user.getEmail(),
                user.getFirstName() + " " + user.getLastName(),
                user.getUserType().toString()
        );
    }

    public void verifyEmail(String token) {
        if (!tokenProvider.validateToken(token)) {
            throw new BadRequestException("Invalid or expired verification token");
        }

        String email = tokenProvider.getUsernameFromToken(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setEmailVerified(true);
        userRepository.save(user);
    }

    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        // Send password reset email with error handling
        try {
            String resetToken = tokenProvider.generatePasswordResetToken(email);
            emailService.sendPasswordResetEmail(email, resetToken);
            System.out.println("Password reset email sent to " + email);
        } catch (Exception e) {
            System.err.println("Failed to send password reset email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void resetPassword(String token, String newPassword) {
        if (!tokenProvider.validateToken(token)) {
            throw new BadRequestException("Invalid or expired reset token");
        }

        String email = tokenProvider.getUsernameFromToken(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
