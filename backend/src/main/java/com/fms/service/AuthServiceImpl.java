package com.fms.service;

import com.fms.config.JwtUtil;
import com.fms.dto.AuthResponse;
import com.fms.dto.LoginRequest;
import com.fms.dto.RegisterRequest;
import com.fms.model.User;
import com.fms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Default implementation of {@link AuthService} that handles user registration
 * and login using BCrypt password hashing and JWT-based authentication.
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    /**
     * Registers a new user account.
     *
     * <p>The plain-text password is hashed with BCrypt before persistence.
     * A JWT is generated immediately so the caller is authenticated upon
     * successful registration.</p>
     *
     * @param request registration details (name, email, password)
     * @return an {@link AuthResponse} containing a JWT and the user's profile fields
     * @throws RuntimeException if the email address is already in use
     */
    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getEmail(), user.getFirstName(), user.getLastName());
    }

    /**
     * Authenticates an existing user by email and password.
     *
     * @param request login credentials (email, password)
     * @return an {@link AuthResponse} containing a fresh JWT and profile fields
     * @throws RuntimeException if the email is not found or the password does not match
     */
    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getEmail(), user.getFirstName(), user.getLastName());
    }
}
