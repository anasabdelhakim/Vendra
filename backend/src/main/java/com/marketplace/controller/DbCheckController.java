package com.marketplace.controller;

import com.marketplace.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DbCheckController {

    private final UserRepository userRepository;

    public DbCheckController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/db-check")
    public String checkDb() {
        try {
            long count = userRepository.count(); // try querying the DB
            return "Database is working! Users count: " + count;
        } catch (Exception e) {
            return "Database is NOT working!";
        }
    }
}
