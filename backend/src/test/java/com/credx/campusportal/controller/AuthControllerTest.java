package com.credx.campusportal.controller;

import com.credx.campusportal.dto.auth.JwtResponse;
import com.credx.campusportal.dto.auth.LoginRequest;
import com.credx.campusportal.dto.auth.RegisterRequest;
import com.credx.campusportal.entity.User;
import com.credx.campusportal.entity.enums.Role;
import com.credx.campusportal.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegister_Success() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("student@credx.com");
        request.setPassword("password");
        request.setRole(Role.STUDENT);

        User mockUser = User.builder()
                .id(1L)
                .email("student@credx.com")
                .role(Role.STUDENT)
                .build();

        when(authService.register(any(RegisterRequest.class))).thenReturn(mockUser);

        ResponseEntity<User> response = authController.register(request);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("student@credx.com", response.getBody().getEmail());
    }

    @Test
    void testLogin_Success() {
        LoginRequest request = new LoginRequest();
        request.setEmail("student@credx.com");
        request.setPassword("password");

        JwtResponse mockJwtResponse = new JwtResponse("token", 1L, "student@credx.com", "STUDENT");

        when(authService.login(any(LoginRequest.class))).thenReturn(mockJwtResponse);

        ResponseEntity<JwtResponse> response = authController.login(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("token", response.getBody().getToken());
    }
}
