package com.fms;

import com.fms.config.JwtUtil;
import com.fms.service.AuthServiceImpl;
import com.fms.dto.AuthResponse;
import com.fms.dto.LoginRequest;
import com.fms.dto.RegisterRequest;
import com.fms.model.User;
import com.fms.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    UserRepository userRepository;

    // Use real implementations — no need to mock these concrete classes
    PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    JwtUtil jwtUtil = new JwtUtil();

    AuthServiceImpl authService;

    private User existingUser;
    private static final String HASHED_PASSWORD = new BCryptPasswordEncoder().encode("password123");

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(jwtUtil, "jwtSecret",
                "numo-test-secret-key-must-be-at-least-32-characters");
        ReflectionTestUtils.setField(jwtUtil, "jwtExpirationMs", 86400000L);

        authService = new AuthServiceImpl(userRepository, passwordEncoder, jwtUtil);

        existingUser = new User();
        existingUser.setId(1L);
        existingUser.setFirstName("Jane");
        existingUser.setLastName("Doe");
        existingUser.setEmail("jane@university.edu");
        existingUser.setPasswordHash(HASHED_PASSWORD);
    }

    // ── register ──────────────────────────────────────────────────────────────

    @Test
    void register_savesUserAndReturnsAuthResponse() {
        RegisterRequest req = new RegisterRequest();
        req.setFirstName("Jane"); req.setLastName("Doe");
        req.setEmail("jane@university.edu"); req.setPassword("password123");

        when(userRepository.existsByEmail("jane@university.edu")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(existingUser);

        AuthResponse response = authService.register(req);

        assertThat(response.getToken()).isNotBlank();
        assertThat(response.getEmail()).isEqualTo("jane@university.edu");
        assertThat(response.getFirstName()).isEqualTo("Jane");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_throwsWhenEmailAlreadyExists() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("jane@university.edu");

        when(userRepository.existsByEmail("jane@university.edu")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(req))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Email already in use");

        verify(userRepository, never()).save(any());
    }

    @Test
    void register_hashesPasswordBeforeSaving() {
        RegisterRequest req = new RegisterRequest();
        req.setFirstName("Jane"); req.setLastName("Doe");
        req.setEmail("jane@university.edu"); req.setPassword("plaintext");

        when(userRepository.existsByEmail(any())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User saved = inv.getArgument(0);
            // password should NOT be stored as plaintext
            assertThat(saved.getPasswordHash()).isNotEqualTo("plaintext");
            assertThat(saved.getPasswordHash()).startsWith("$2a$");
            return existingUser;
        });

        authService.register(req);
    }

    // ── login ─────────────────────────────────────────────────────────────────

    @Test
    void login_returnsAuthResponseForValidCredentials() {
        LoginRequest req = new LoginRequest();
        req.setEmail("jane@university.edu"); req.setPassword("password123");

        when(userRepository.findByEmail("jane@university.edu")).thenReturn(Optional.of(existingUser));

        AuthResponse response = authService.login(req);

        assertThat(response.getToken()).isNotBlank();
        assertThat(response.getFirstName()).isEqualTo("Jane");
        assertThat(response.getEmail()).isEqualTo("jane@university.edu");
    }

    @Test
    void login_throwsWhenEmailNotFound() {
        LoginRequest req = new LoginRequest();
        req.setEmail("nobody@university.edu"); req.setPassword("password");

        when(userRepository.findByEmail("nobody@university.edu")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Invalid email or password");
    }

    @Test
    void login_throwsWhenPasswordIsWrong() {
        LoginRequest req = new LoginRequest();
        req.setEmail("jane@university.edu"); req.setPassword("wrongpassword");

        when(userRepository.findByEmail("jane@university.edu")).thenReturn(Optional.of(existingUser));

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Invalid email or password");
    }
}
