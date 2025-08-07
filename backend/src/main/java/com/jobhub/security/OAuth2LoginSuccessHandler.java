package com.jobhub.security;

import java.io.IOException;
import java.net.URLEncoder; // Import the UserType enum
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.jobhub.entity.User;
import com.jobhub.entity.UserType;
import com.jobhub.repository.UserRepository;
import com.jobhub.security.jwt.JwtHelper;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtHelper jwtHelper;
    private final UserRepository userRepository;

    public OAuth2LoginSuccessHandler(JwtHelper jwtHelper, UserRepository userRepository) {
        this.jwtHelper = jwtHelper;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {
        System.out.println("OAuth2LoginSuccessHandler invoked for user: " + authentication.getName());

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");
        String givenName = oauthUser.getAttribute("given_name");
        String familyName = oauthUser.getAttribute("family_name");

        // ✅ FIX: Find user or create a new one if they don't exist
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            System.out.println("User not found. Creating new user for: " + email);
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFirstName(givenName != null ? givenName : name); // Use given_name or full name
            newUser.setLastName(familyName != null ? familyName : "");   // Use family_name or empty string
            newUser.setPassword(""); // No password for OAuth users
            
            // ✅ CRUCIAL: Set the default role for new Google sign-ups
            newUser.setUserType(UserType.JOBSEEKER); 
            
            newUser.setEmailVerified(true);
            newUser.setEnabled(true);
            newUser.setIsActive(true);
            
            return userRepository.save(newUser);
        });

        // ✅ FIX: Prepare roles correctly using the user's UserType
        String userRole = user.getUserType().name(); // This will be "JOB_SEEKER" or "EMPLOYER"
        List<String> roles = List.of(userRole);

        // ✅ Generate JWT with the correct email and roles
        String token = jwtHelper.generateToken(user.getEmail(), roles);

        // Redirect to the frontend with the token
        String redirectUrl = "http://localhost:5173/login/oauth-success" +
                "?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8) +
                "&name=" + URLEncoder.encode(user.getFirstName(), StandardCharsets.UTF_8) +
                "&email=" + URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8);

        System.out.println("Redirecting OAuth user to: " + redirectUrl);
        response.sendRedirect(redirectUrl);
    }
}
