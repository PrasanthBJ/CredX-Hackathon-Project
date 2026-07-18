package com.credx.campusportal.controller;

import com.credx.campusportal.entity.User;
import com.credx.campusportal.security.CustomUserDetails;
import com.credx.campusportal.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final AuthService authService;

    public UserController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/settings")
    public ResponseEntity<Map<String, Object>> getSettings(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = authService.getUserById(userDetails.getId());
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole().name());
        response.put("profileImage", user.getProfileImage());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/settings")
    public ResponseEntity<Map<String, Object>> updateSettings(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");
        String profileImage = request.get("profileImage");

        User updatedUser = authService.updateSettings(userDetails.getId(), name, email, currentPassword, newPassword, profileImage);
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", updatedUser.getId());
        response.put("name", updatedUser.getName());
        response.put("email", updatedUser.getEmail());
        response.put("role", updatedUser.getRole().name());
        response.put("profileImage", updatedUser.getProfileImage());
        response.put("message", "Settings updated successfully");
        return ResponseEntity.ok(response);
    }
}
