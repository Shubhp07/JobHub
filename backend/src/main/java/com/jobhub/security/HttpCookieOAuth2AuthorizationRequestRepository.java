package com.jobhub.security;

import java.util.Base64;

import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.SerializationUtils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Stores the OAuth2 authorization request in a short-lived HTTP cookie so the
 * flow works with SessionCreationPolicy.STATELESS (no server-side session).
 *
 * The cookie is base64-encoded Java serialization of the
 * OAuth2AuthorizationRequest object (same approach as many production guides;
 * the object is framework-internal and not sensitive beyond the state nonce).
 */
@Component
public class HttpCookieOAuth2AuthorizationRequestRepository
        implements AuthorizationRequestRepository<OAuth2AuthorizationRequest> {

    public static final String OAUTH2_AUTH_REQUEST_COOKIE = "oauth2_auth_request";
    private static final int COOKIE_EXPIRE_SECONDS = 180; // 3 minutes – enough for the Google round-trip

    // -------------------------------------------------------------------------
    // AuthorizationRequestRepository contract
    // -------------------------------------------------------------------------

    @Override
    public OAuth2AuthorizationRequest loadAuthorizationRequest(HttpServletRequest request) {
        return getCookieValue(request, OAUTH2_AUTH_REQUEST_COOKIE)
                .map(v -> (OAuth2AuthorizationRequest) deserialize(v))
                .orElse(null);
    }

    @Override
    public void saveAuthorizationRequest(OAuth2AuthorizationRequest authorizationRequest,
            HttpServletRequest request, HttpServletResponse response) {
        if (authorizationRequest == null) {
            deleteCookie(request, response, OAUTH2_AUTH_REQUEST_COOKIE);
            return;
        }
        addCookie(response, OAUTH2_AUTH_REQUEST_COOKIE,
                serialize(authorizationRequest), COOKIE_EXPIRE_SECONDS);
    }

    @Override
    public OAuth2AuthorizationRequest removeAuthorizationRequest(
            HttpServletRequest request, HttpServletResponse response) {
        OAuth2AuthorizationRequest authRequest = loadAuthorizationRequest(request);
        deleteCookie(request, response, OAUTH2_AUTH_REQUEST_COOKIE);
        return authRequest;
    }

    // -------------------------------------------------------------------------
    // Cookie helpers
    // -------------------------------------------------------------------------

    private static void addCookie(HttpServletResponse response, String name,
            String value, int maxAgeSeconds) {
        Cookie cookie = new Cookie(name, value);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(maxAgeSeconds);
        cookie.setSecure(true);   // Render always serves HTTPS
        cookie.setAttribute("SameSite", "None"); // cross-site redirect from Google requires None
        response.addCookie(cookie);
    }

    private static void deleteCookie(HttpServletRequest request,
            HttpServletResponse response, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(name)) {
                    cookie.setValue("");
                    cookie.setPath("/");
                    cookie.setMaxAge(0);
                    response.addCookie(cookie);
                    break;
                }
            }
        }
    }

    private static java.util.Optional<String> getCookieValue(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(name)) {
                    return java.util.Optional.of(cookie.getValue());
                }
            }
        }
        return java.util.Optional.empty();
    }

    // -------------------------------------------------------------------------
    // Serialization helpers
    // -------------------------------------------------------------------------

    @SuppressWarnings("deprecation") // SerializationUtils is fine for internal framework types
    private static String serialize(Object object) {
        return Base64.getUrlEncoder()
                .encodeToString(SerializationUtils.serialize(object));
    }

    @SuppressWarnings({"deprecation", "unchecked"})
    private static <T> T deserialize(String base64) {
        try {
            return (T) SerializationUtils.deserialize(
                    Base64.getUrlDecoder().decode(base64));
        } catch (Exception e) {
            // Cookie is corrupt or tampered – return null so the flow restarts cleanly
            return null;
        }
    }
}
