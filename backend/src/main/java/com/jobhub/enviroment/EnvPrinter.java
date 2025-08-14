package com.jobhub.enviroment;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class EnvPrinter implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(EnvPrinter.class);
    private final Environment env;

    public EnvPrinter(Environment env) {
        this.env = env;
    }

    @Override
    public void run(String... args) throws Exception {
        // Log the configured Google OAuth2 redirect URI property value
        logger.info("Value of SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_REDIRECT_URI: {}",
                    env.getProperty("spring.security.oauth2.client.registration.google.redirect-uri"));
    }
}
