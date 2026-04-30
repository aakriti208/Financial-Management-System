# Prompt 03 — Authentication (JWT + Spring Security)
**Phase:** Security Layer

---

## Context
Data models are done. Need to implement stateless JWT authentication. Users register and log in — no session storage, everything is token-based. The JWT filter must run before Spring's built-in auth filter.

---

## Prompt

```
Implement stateless JWT authentication for the FMS Spring Boot backend.
Package root: com.fms. Stack: Spring Boot 3.2, Spring Security 6, jjwt 0.11.5.

Generate the following files:

### 1. com.fms.config.JwtUtil (@Component)
Public methods (signatures are fixed — do not change):
  String generateToken(String email)
  String extractEmail(String token)
  boolean validateToken(String token)

Rules:
- Inject @Value("${jwt.secret}") String secret and @Value("${jwt.expiration-ms}") long expirationMs
- Signing key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)), algorithm HS256
- Subject claim = user's email
- validateToken: parse token, verify not expired; on ANY JwtException return false (never throw)

### 2. com.fms.config.JwtAuthenticationFilter (extends OncePerRequestFilter)
doFilterInternal logic:
1. Read Authorization header. If null or does not start with "Bearer ", call chain.doFilter and return.
2. Extract token = header.substring(7)
3. If jwtUtil.validateToken(token) is true:
   a. email = jwtUtil.extractEmail(token)
   b. Set SecurityContextHolder with UsernamePasswordAuthenticationToken(email, null, emptyList())
4. Always call chain.doFilter(request, response)

### 3. com.fms.config.SecurityConfig (@Configuration @EnableWebSecurity)
- @Bean PasswordEncoder -> new BCryptPasswordEncoder()
- @Bean SecurityFilterChain:
    http.cors(withDefaults())
        .csrf(disable)
        .sessionManagement(STATELESS)
        .authorizeHttpRequests:
            /api/auth/** -> permitAll
            /error       -> permitAll
            everything else -> authenticated
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter)

### 4. com.fms.config.CorsConfig (@Configuration)
- Allow origin: http://localhost:5173
- Allow methods: GET, POST, PUT, DELETE, OPTIONS
- Allow all headers
- AllowCredentials: true
- Apply to /api/**

### 5. DTOs in com.fms.dto:
RegisterRequest { @NotBlank firstName, lastName; @Email @NotBlank email; @Size(min=8) password }
LoginRequest    { @Email @NotBlank email; @NotBlank password }
AuthResponse    { String token, email, firstName, lastName }

### 6. com.fms.service.AuthService (interface) + AuthServiceImpl
register(RegisterRequest):
  - If email already exists -> throw RuntimeException("Email already in use")
  - Hash password with BCrypt, save User, generate JWT, return AuthResponse

login(LoginRequest):
  - Find user by email, orElseThrow RuntimeException("Invalid email or password")
  - BCrypt matches check, throw same message if mismatch
  - Generate fresh JWT, return AuthResponse

### 7. com.fms.controller.AuthController
POST /api/auth/register -> 201 Created + AuthResponse
POST /api/auth/login    -> 200 OK + AuthResponse
Both use @Valid @RequestBody.

CRITICAL: /api/auth/** must work without a JWT. BCrypt hash before every save.
DO NOT store plain text passwords anywhere.
```
