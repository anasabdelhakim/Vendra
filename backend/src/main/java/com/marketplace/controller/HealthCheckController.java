package com.marketplace.controller;

import com.marketplace.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthCheckController {

    private final UserRepository userRepository;

    public HealthCheckController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/health")
    public String healthCheck() {
        try {
            long count = userRepository.count();
            return "✅ Spring Boot is running and DB is connected! Total Users: " + count;
        } catch (Exception e) {
            return "❌ Spring Boot is running but failed to connect to DB: " + e.getMessage();
        }
    }
}
