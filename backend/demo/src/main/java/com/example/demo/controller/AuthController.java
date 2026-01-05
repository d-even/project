package com.example.demo.controller;

import java.time.Instant;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public record LoginRequest(String username, String password) {}
    public record RegisterRequest(String username, String password) {}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        var userOpt = userRepository.findByUsername(request.username());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Invalid credentials"));
        }
        User user = userOpt.get();
        // NOTE: In production, use password hashing and secure storage
        if (!user.getPassword().equals(request.password())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Invalid credentials"));
        }
        user.setLastLoginAt(Instant.now());
        userRepository.save(user);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Login successful",
            "username", user.getUsername(),
            "createdAt", user.getCreatedAt(),
            "lastLoginAt", user.getLastLoginAt()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request.username() == null || request.username().isBlank() ||
            request.password() == null || request.password().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Username and password required"));
        }

        var existing = userRepository.findByUsername(request.username());
        if (existing.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("success", false, "message", "Username already exists"));
        }

        User created = userRepository.save(new User(request.username(), request.password()));
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "message", "User created",
            "username", created.getUsername(),
            "createdAt", created.getCreatedAt()
        ));
    }
}
