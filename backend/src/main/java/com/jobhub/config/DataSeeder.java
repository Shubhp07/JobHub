package com.jobhub.config;

import com.jobhub.user.User;
import com.jobhub.user.UserRepository;
import com.jobhub.user.UserType;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@jobhub.com";
        
        // Check if the user already exists to prevent duplicate entries
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User adminUser = new User();
            adminUser.setFirstName("System");
            adminUser.setLastName("Admin");
            adminUser.setEmail(adminEmail);
            
            // It's crucial to encrypt the password before saving!
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            
            adminUser.setUserType(UserType.ADMIN);
            adminUser.setEmailVerified(true);
            adminUser.setEnabled(true);
            adminUser.setIsActive(true);
            
            userRepository.save(adminUser);
            System.out.println("✅ Seed user (Admin) created successfully.");
        }
    }
}
