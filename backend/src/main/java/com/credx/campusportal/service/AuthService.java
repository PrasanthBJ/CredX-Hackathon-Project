package com.credx.campusportal.service;

import com.credx.campusportal.dto.auth.JwtResponse;
import com.credx.campusportal.dto.auth.LoginRequest;
import com.credx.campusportal.dto.auth.RegisterRequest;
import com.credx.campusportal.entity.User;
import com.credx.campusportal.repository.UserRepository;
import com.credx.campusportal.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.emailService = emailService;
    }

    @org.springframework.transaction.annotation.Transactional
    public User register(RegisterRequest request) {
        java.util.Optional<User> existingUserOpt = userRepository.findByEmail(request.getEmail());
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();
            if (existingUser.isEmailVerified()) {
                throw new com.credx.campusportal.exception.EmailConflictException("email already registered");
            }
            if (existingUser.getVerificationTokenExpiry() != null && 
                existingUser.getVerificationTokenExpiry().isAfter(java.time.LocalDateTime.now())) {
                throw new com.credx.campusportal.exception.EmailConflictException("verification pending, check your email");
            }
            // Expired unverified user: delete stale record
            userRepository.delete(existingUser);
            userRepository.flush();
        }

        String token = java.util.UUID.randomUUID().toString();
        java.time.LocalDateTime expiry = java.time.LocalDateTime.now().plusMinutes(1);

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .emailVerified(false)
                .verificationToken(token)
                .verificationTokenExpiry(expiry)
                .build();

        User savedUser = userRepository.save(user);

        // Send email asynchronously
        emailService.sendVerificationEmail(savedUser.getEmail(), savedUser.getName(), token);

        return savedUser;
    }

    public JwtResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new org.springframework.security.authentication.BadCredentialsException("Invalid email or password"));

        if (!user.isEmailVerified()) {
            throw new com.credx.campusportal.exception.EmailUnverifiedException("please verify your email before logging in");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        return new JwtResponse(token, user.getId(), user.getEmail(), user.getRole().name());
    }

    @org.springframework.transaction.annotation.Transactional
    public void verifyEmail(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new com.credx.campusportal.exception.EmailVerificationException("Invalid verification token");
        }

        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new com.credx.campusportal.exception.EmailVerificationException("Invalid or expired verification token"));

        if (user.getVerificationTokenExpiry() == null || 
            user.getVerificationTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new com.credx.campusportal.exception.EmailVerificationException("Invalid or expired verification token");
        }

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);

        userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new com.credx.campusportal.exception.ResourceNotFoundException("User not found"));
    }

    @org.springframework.transaction.annotation.Transactional
    public User updateSettings(Long userId, String name, String email, String currentPassword, String newPassword, String profileImage) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new com.credx.campusportal.exception.ResourceNotFoundException("User not found"));

        if (email != null && !email.trim().isEmpty() && !email.equalsIgnoreCase(user.getEmail())) {
            if (userRepository.findByEmail(email).isPresent()) {
                throw new com.credx.campusportal.exception.EmailConflictException("Email already taken");
            }
            user.setEmail(email);
        }

        if (name != null && !name.trim().isEmpty()) {
            user.setName(name);
        }

        if (profileImage != null) {
            user.setProfileImage(profileImage);
        }

        if (currentPassword != null && !currentPassword.isEmpty() && newPassword != null && !newPassword.isEmpty()) {
            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                throw new org.springframework.security.authentication.BadCredentialsException("Current password does not match");
            }
            if (newPassword.length() < 6) {
                throw new IllegalArgumentException("New password must be at least 6 characters");
            }
            user.setPassword(passwordEncoder.encode(newPassword));
        }

        return userRepository.save(user);
    }
}
