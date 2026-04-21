package com.fms.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

/**
 * Utility component for generating, validating, and parsing JSON Web Tokens (JWTs).
 *
 * <p>Tokens are signed with HMAC-SHA256 using the secret configured via
 * {@code jwt.secret} in {@code application.properties} and expire after the
 * configured duration (default: 24 hours = 86 400 000 ms).</p>
 */
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration-ms:86400000}")
    private long jwtExpirationMs;

    /**
     * Builds the HMAC-SHA signing key from the configured secret.
     *
     * @return a {@link Key} suitable for HS256 signing
     */
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Generates a signed JWT with the given email as the subject claim.
     *
     * @param email the authenticated user's email address
     * @return a compact, URL-safe JWT string
     */
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Validates the given token by verifying its signature and checking that it
     * has not expired.
     *
     * @param token the JWT to validate
     * @return {@code true} if the token is well-formed, correctly signed, and
     *         not expired; {@code false} otherwise
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    /**
     * Extracts the email address (subject claim) from a valid JWT.
     *
     * @param token a valid, non-expired JWT previously issued by this utility
     * @return the email address stored in the token's {@code sub} claim
     * @throws io.jsonwebtoken.JwtException if the token is invalid or expired
     */
    public String extractEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
