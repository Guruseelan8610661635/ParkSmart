package com.smartparking.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.smartparking.model.Role;
import com.smartparking.model.User;
import com.smartparking.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        
        // Create default admin user if not exists
        if (userRepository.findByEmail("admin@smartparking.com").isEmpty()) {
            User admin = new User();
            admin.setEmail("admin@smartparking.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setName("System Administrator");
            admin.setRole(Role.ADMIN);
            
            userRepository.save(admin);
            System.out.println("✅ Default Admin User Created");
            System.out.println("   Email: admin@smartparking.com");
            System.out.println("   Password: admin123");
        }
        
        // Create default regular user if not exists
        if (userRepository.findByEmail("user@smartparking.com").isEmpty()) {
            User user = new User();
            user.setEmail("user@smartparking.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setName("Test User");
            user.setRole(Role.USER);
            
            userRepository.save(user);
            System.out.println("✅ Default Test User Created");
            System.out.println("   Email: user@smartparking.com");
            System.out.println("   Password: user123");
        }
    }
}
