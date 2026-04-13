package com.fms.service;

import com.fms.dto.AuthResponse;
import com.fms.dto.LoginRequest;
import com.fms.dto.RegisterRequest;
import com.fms.model.User;
import com.fms.repository.UserRepository;
import com.fms.service.AuthService;
import com.fms.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public AuthResponse register(RegisterRequest request) {

        // Check if email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create user
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());

        // Hash password
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        // Save user
        userRepository.save(user);

        // Generate JWT
        String token = jwtUtil.generateToken(user.getEmail());

        //  Return response
        return new AuthResponse(
                token,
                user.getEmail(),
                user.getFirstName(),
                user.getLastName()
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        //  Find user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        //  Check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }

        //  Generate JWT
        String token = jwtUtil.generateToken(user.getEmail());

        //  Return response
        return new AuthResponse(
                token,
                user.getEmail(),
                user.getFirstName(),
                user.getLastName()
        );
    }
}