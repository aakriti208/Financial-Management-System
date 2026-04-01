package com.fms.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration-ms:86400000}")
    private long jwtExpirationMs;

    /**
     * Generate a signed JWT token for the given email address.
     * TODO: Use Jwts.builder() with subject=email, issuedAt=new Date(),
     *       expiration=new Date(now + jwtExpirationMs), signWith(HS256, jwtSecret)
     */
    public String generateToken(String email) {
        // TODO: Implement token generation
        return null;
    }

    /**
     * Validate a JWT token (signature + expiry).
     * TODO: Use Jwts.parserBuilder().setSigningKey(jwtSecret).build().parseClaimsJws(token)
     *       Catch JwtException and return false if invalid or expired
     */
    public boolean validateToken(String token) {
        // TODO: Implement token validation
        return false;
    }

    /**
     * Extract the email (subject) claim from a JWT token.
     * TODO: Parse token, call .getBody().getSubject()
     */
    public String extractEmail(String token) {
        // TODO: Implement claim extraction
        return null;
    }
}
