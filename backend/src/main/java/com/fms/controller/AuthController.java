package com.fms.controller;

import com.fms.dto.AuthResponse;
import com.fms.dto.LoginRequest;
import com.fms.dto.RegisterRequest;
import com.fms.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller exposing public authentication endpoints.
 *
 * <p>These endpoints are accessible without a JWT ({@code /api/auth/**} is
 * configured as {@code permitAll()} in {@code SecurityConfig}).</p>
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Registers a new user account.
     *
     * @param request validated registration payload
     * @return {@code 201 Created} with an {@link AuthResponse} containing a JWT
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(201).body(authService.register(request));
    }

    /**
     * Authenticates an existing user and returns a fresh JWT.
     *
     * @param request validated login credentials
     * @return {@code 200 OK} with an {@link AuthResponse} containing a JWT
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
