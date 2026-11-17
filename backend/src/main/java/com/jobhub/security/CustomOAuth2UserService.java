package com.jobhub.security;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.jobhub.user.User;
import com.jobhub.user.UserType;
import com.jobhub.user.UserRepository;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User;
        try {
            oauth2User = super.loadUser(userRequest);
        } catch (Exception ex) {
            System.err.println("[CustomOAuth2UserService] Failed to load user from Google: " + ex.getMessage());
            throw ex;
        }

        String email = oauth2User.getAttribute("email");
        String name  = oauth2User.getAttribute("name");
        String picture = oauth2User.getAttribute("picture");

        System.out.println("[CustomOAuth2UserService] Google OAuth2 login for: " + email);

        if (email == null || email.isBlank()) {
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("missing_email"), "Google did not return an email address");
        }

        try {
            Optional<User> existingUser = userRepository.findByEmail(email);

            if (existingUser.isEmpty()) {
                System.out.println("[CustomOAuth2UserService] First-time login – creating user for: " + email);

                // Split "Given Family" safely
                String[] parts = (name != null && !name.isBlank())
                        ? name.split(" ", 2)
                        : new String[]{"Unknown", "User"};

                User newUser = new User();
                newUser.setEmail(email);
                newUser.setFirstName(parts[0].isBlank() ? "Unknown" : parts[0]);
                newUser.setLastName(parts.length > 1 && !parts[1].isBlank() ? parts[1] : "User");
                // Placeholder – not used for auth but satisfies @NotBlank @Size(min=8)
                newUser.setPassword("GOOGLE_AUTH_PLACEHOLDER");
                newUser.setUserType(UserType.JOBSEEKER);
                newUser.setEmailVerified(true);
                newUser.setIsActive(true);
                newUser.setEnabled(true);           // ← critical: prevents DisabledException
                // Truncate picture URL to 255 chars to match the default varchar column
                if (picture != null && picture.length() > 255) {
                    picture = picture.substring(0, 255);
                }
                newUser.setProfilePicture(picture);

                userRepository.save(newUser);
                System.out.println("[CustomOAuth2UserService] New user saved: " + email);
            } else {
                System.out.println("[CustomOAuth2UserService] Existing user found: " + email);
            }
        } catch (Exception ex) {
            System.err.println("[CustomOAuth2UserService] DB error while processing user " + email + ": " + ex.getMessage());
            ex.printStackTrace();
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("db_error"), "Database error during OAuth2 login: " + ex.getMessage(), ex);
        }

        return oauth2User;
    }
}
