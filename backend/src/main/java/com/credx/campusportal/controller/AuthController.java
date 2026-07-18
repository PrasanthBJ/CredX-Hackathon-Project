package com.credx.campusportal.controller;

import com.credx.campusportal.dto.auth.JwtResponse;
import com.credx.campusportal.dto.auth.LoginRequest;
import com.credx.campusportal.dto.auth.RegisterRequest;
import com.credx.campusportal.entity.User;
import com.credx.campusportal.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody RegisterRequest request) {
        User user = authService.register(request);
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@Valid @RequestBody LoginRequest request) {
        JwtResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/verify-email")
    public ResponseEntity<java.util.Map<String, String>> verifyEmail(@RequestParam("token") String token) {
        authService.verifyEmail(token);
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("message", "Email verified — access granted, you can now log in");
        return ResponseEntity.ok(response);
    }
}
