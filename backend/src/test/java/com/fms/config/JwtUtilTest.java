package com.fms.config;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    private static final String SECRET = "numo-test-secret-key-must-be-at-least-32-characters";
    private static final String EMAIL  = "jane@university.edu";

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "jwtSecret", SECRET);
        ReflectionTestUtils.setField(jwtUtil, "jwtExpirationMs", 86400000L);
    }

    @Test
    void generateToken_returnsNonNullString() {
        String token = jwtUtil.generateToken(EMAIL);
        assertThat(token).isNotNull().isNotBlank();
    }

    @Test
    void generateToken_producesThreePartJwt() {
        String token = jwtUtil.generateToken(EMAIL);
        assertThat(token.split("\\.")).hasSize(3);
    }

    @Test
    void validateToken_returnsTrueForFreshToken() {
        String token = jwtUtil.generateToken(EMAIL);
        assertThat(jwtUtil.validateToken(token)).isTrue();
    }

    @Test
    void validateToken_returnsFalseForGarbage() {
        assertThat(jwtUtil.validateToken("not.a.token")).isFalse();
    }

    @Test
    void validateToken_returnsFalseForTamperedToken() {
        String token = jwtUtil.generateToken(EMAIL);
        String tampered = token.substring(0, token.length() - 4) + "xxxx";
        assertThat(jwtUtil.validateToken(tampered)).isFalse();
    }

    @Test
    void extractEmail_returnsCorrectSubject() {
        String token = jwtUtil.generateToken(EMAIL);
        assertThat(jwtUtil.extractEmail(token)).isEqualTo(EMAIL);
    }

    @Test
    void extractEmail_isConsistentAcrossMultipleTokens() {
        String token1 = jwtUtil.generateToken(EMAIL);
        String token2 = jwtUtil.generateToken(EMAIL);
        assertThat(jwtUtil.extractEmail(token1)).isEqualTo(jwtUtil.extractEmail(token2));
    }
}
