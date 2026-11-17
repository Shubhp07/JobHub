package com.jobhub.security;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.jobhub.user.User;
import com.jobhub.user.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public OAuth2LoginSuccessHandler(JwtTokenProvider jwtTokenProvider, UserRepository userRepository) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");

        System.out.println("[OAuth2LoginSuccessHandler] Invoked for email: " + email);

        // User was already created/found by CustomOAuth2UserService – just look it up.
        User user = userRepository.findByEmail(email).orElseThrow(() ->
                new IllegalStateException("OAuth2 user not found in DB after CustomOAuth2UserService ran: " + email));

        String userRole = user.getUserType().name();
        List<String> roles = List.of(userRole);

        String token = jwtTokenProvider.generateToken(user.getEmail(), roles);

        // HttpOnly cookie – secure=true because Render always serves HTTPS.
        // SameSite=None is required for the cross-site redirect from Google.
        org.springframework.http.ResponseCookie cookie = org.springframework.http.ResponseCookie
                .from("jwt", token)
                .httpOnly(true)
                .secure(true)                   // ← was false; must be true on HTTPS
                .path("/")
                .maxAge(24 * 60 * 60)
                .sameSite("None")               // required for cross-origin cookie after redirect
                .build();
        response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, cookie.toString());

        String redirectUrl = frontendUrl + "/login/oauth-success"
                + "?name="         + URLEncoder.encode(user.getFirstName(), StandardCharsets.UTF_8)
                + "&email="        + URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8)
                + "&access_token=" + URLEncoder.encode(token, StandardCharsets.UTF_8);

        System.out.println("[OAuth2LoginSuccessHandler] Redirecting to: " + redirectUrl);
        response.sendRedirect(redirectUrl);
    }
}

