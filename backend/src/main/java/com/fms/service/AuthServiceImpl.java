package com.fms.service;

import com.fms.dto.AuthResponse;
import com.fms.dto.LoginRequest;
import com.fms.dto.RegisterRequest;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Override
    public AuthResponse register(RegisterRequest request) {
        // TODO: Check if email already exists (throw exception if duplicate)
        // TODO: Hash password with BCryptPasswordEncoder
        // TODO: Create and save User entity
        // TODO: Generate JWT token via JwtUtil.generateToken()
        // TODO: Return AuthResponse with token and user info
        return null;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // TODO: Look up user by email (throw exception if not found)
        // TODO: Verify password matches stored hash
        // TODO: Generate JWT token via JwtUtil.generateToken()
        // TODO: Return AuthResponse with token and user info
        return null;
    }
}
