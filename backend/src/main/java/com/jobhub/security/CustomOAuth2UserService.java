package com.jobhub.security;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.jobhub.entity.User;
import com.jobhub.entity.UserType;
import com.jobhub.repository.UserRepository;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String picture = oauth2User.getAttribute("picture");

        System.out.println("OAuth2 login: " + email);

        if (email != null) {
            Optional<User> existingUser = userRepository.findByEmail(email);

            if (existingUser.isEmpty()) {
                // Split name into first and last
                String[] nameParts = name != null ? name.split(" ", 2) : new String[]{"", ""};

                User user = new User();
                user.setEmail(email);
                user.setFirstName(nameParts[0]);
                user.setLastName(nameParts.length > 1 ? nameParts[1] : "");
                user.setPassword("GOOGLE_AUTH"); // not used, just placeholder
                user.setUserType(UserType.JOBSEEKER); // default role
                user.setEmailVerified(true);
                user.setIsActive(true);
                user.setProfilePicture(picture);
                userRepository.save(user);
            }
        }

        return oauth2User;
    }
}
