# Prompts — Financial Management System (FMS)

**Course:** CS 5394 — Group 2
**Members:** Aakriti Dhakal, Agnes Jesionowska, Manoj Khanal
**Project:** AI-powered financial management web application for international students
**Document Purpose:** Record of the implementation prompts used to generate the source code for the Financial Management System.

---

## Authoring Conventions (applied to every prompt below)

> 1. **Sandwich Method** — the most critical requirement is repeated at the top _and_ the bottom of the prompt.
> 2. **Attention Anchoring** — `MANDATORY`, `CRITICAL`, and `DO NOT` directives are placed inline at the exact step they govern.
> 3. **Visual Emphasis** — **bold text**, `inline code`, and fenced code blocks separate instructions from filler.
> 4. **Clear Delimiters** — every prompt uses `###` sub-headings and triple-backtick fences so the LLM can parse sections unambiguously.
> 5. **Selective Context** — each prompt carries _only_ the context needed for its one component (entity shapes, sibling filenames, DTO names) — never the entire codebase.

---

## Tech Stack Constraint Block (prepended to every code-generation prompt)

```text
### STACK — DO NOT DEVIATE
Backend  : Java 17, Spring Boot 3.2.x, Maven, Spring Data JPA, Spring Security, jjwt 0.11.5
Frontend : React 18, Vite 5, Tailwind CSS 3, Axios, React Router v6, Recharts
Database : PostgreSQL 15 (schema auto-managed by Hibernate `ddl-auto=update`)
AI       : OpenAI Chat Completions API (model: gpt-4o-mini)
Auth     : Stateless JWT (HS256), Bearer token in Authorization header
Package  : com.fms (backend root)
```

---

# Part 1 — Backend Implementation Prompts

## P1. Project Scaffolding & `pom.xml`

> **CRITICAL:** The generated `pom.xml` **MUST** compile against **Java 17** and pull in **Spring Boot 3.2.x**, **Spring Security**, **Spring Data JPA**, **PostgreSQL driver**, **jjwt 0.11.5** (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`), and **Spring Boot Starter Validation**. No other heavy dependencies.

### Prompt

```text
You are generating a Maven pom.xml for a Spring Boot 3 backend.

### REQUIREMENTS
- groupId: com.fms
- artifactId: fms-backend
- java.version: 17
- Parent: spring-boot-starter-parent 3.2.5
- Dependencies (MANDATORY, exact artifacts):
    * spring-boot-starter-web
    * spring-boot-starter-data-jpa
    * spring-boot-starter-security
    * spring-boot-starter-validation
    * org.postgresql:postgresql (runtime)
    * io.jsonwebtoken:jjwt-api:0.11.5
    * io.jsonwebtoken:jjwt-impl:0.11.5 (runtime)
    * io.jsonwebtoken:jjwt-jackson:0.11.5 (runtime)
    * spring-boot-starter-test (test scope)

### OUTPUT
A single valid pom.xml file. No commentary. DO NOT include lombok or spring-boot-devtools.

### CRITICAL REMINDER
Target = Java 17. Spring Boot 3.2.5. The three jjwt artifacts MUST all be present.
```

---

## P2. `application.properties`

> **MANDATORY:** Every secret (`jwt.secret`, `openai.api.key`, `spring.datasource.password`) **MUST** be placeholder-only — never committed values.

### Prompt

```text
Generate backend/src/main/resources/application.properties for the FMS Spring Boot backend.

### REQUIREMENTS
- Port: 8080
- Datasource: PostgreSQL at jdbc:postgresql://localhost:5432/fms_db
- JPA: hibernate.ddl-auto=update, show-sql=true, dialect=PostgreSQLDialect
- JWT: jwt.secret=REPLACE_WITH_LONG_RANDOM_STRING_MIN_32_CHARS, jwt.expiration-ms=86400000
- OpenAI: openai.api.key=YOUR_OPENAI_API_KEY, openai.model=gpt-4o-mini
- CORS dev origin: http://localhost:5173

### CRITICAL
DO NOT hard-code real secrets. Use the exact placeholder strings above.
```

---

## P3. JPA Entities (`User`, `Income`, `Expense`, `TuitionPlan`)

> **CRITICAL:** Every user-owned entity **MUST** have `@ManyToOne(fetch = LAZY)` to `User` with `@JoinColumn(name="user_id", nullable=false)`. All monetary fields are `BigDecimal(precision=12, scale=2)`. SRS §2.2.2, §2.2.3, §2.2.5.

### Prompt

```text
Generate four JPA entity classes in package com.fms.model for a Spring Boot 3 + Hibernate 6 app.

### ENTITY: User  (table: users)
Fields: id (Long, @Id @GeneratedValue IDENTITY),
        firstName, lastName (String, @NotBlank),
        email (String, unique=true, @Email),
        passwordHash (String, @JsonIgnore on getter),
        createdAt (Instant, default = Instant.now()).

### ENTITY: Income  (table: incomes)
Fields: id, amount (BigDecimal(12,2), @NotNull, @DecimalMin "0.01"),
        source (String, @NotBlank)   // scholarship, part_time_job, family_support, other
        date (LocalDate, @NotNull),
        description (String, nullable),
        user (ManyToOne LAZY, @JoinColumn user_id NOT NULL).

### ENTITY: Expense  (table: expenses)
Fields: id, amount (BigDecimal(12,2), @NotNull, @DecimalMin "0.01"),
        category (String, @NotBlank)  // housing, food, transport, entertainment, other
        date (LocalDate, @NotNull),
        description (String, nullable),
        user (ManyToOne LAZY).

### ENTITY: TuitionPlan  (table: tuition_plans)
Fields: id, tuitionPerCourse (BigDecimal(12,2)), numberOfCourses (Integer, @Min 1),
        scholarshipAmount (BigDecimal(12,2), default 0),
        createdAt (Instant), user (ManyToOne LAZY).

### MANDATORY for all entities
- No-args + all-args constructors
- Getters and setters for every field
- equals/hashCode on id only
- DO NOT expose passwordHash in toString

### CRITICAL REMINDER
Every user-owned entity has ManyToOne(LAZY) to User with user_id NOT NULL.
Amounts are BigDecimal precision=12 scale=2 — NEVER double.
```

---

## P4. Repositories

### Prompt

```text
Generate four Spring Data JPA repositories in package com.fms.repository.
All extend JpaRepository<T, Long>.

### UserRepository
- Optional<User> findByEmail(String email);
- boolean existsByEmail(String email);

### IncomeRepository
- List<Income> findByUserOrderByDateDesc(User user);
- List<Income> findByUserAndDateBetween(User user, LocalDate from, LocalDate to);

### ExpenseRepository
- List<Expense> findByUserOrderByDateDesc(User user);
- List<Expense> findByUserAndDateBetween(User user, LocalDate from, LocalDate to);
- @Query("SELECT e.category, SUM(e.amount) FROM Expense e WHERE e.user = :u GROUP BY e.category")
  List<Object[]> sumByCategory(@Param("u") User user);

### TuitionPlanRepository
- List<TuitionPlan> findByUserOrderByCreatedAtDesc(User user);

### MANDATORY
Return types MUST match exactly. No additional methods.
```

---

## P5. JWT Utility (`JwtUtil`)

> **CRITICAL:** Tokens **MUST** be signed with `Keys.hmacShaKeyFor(secret.getBytes())` using **HS256**. The subject claim **MUST** be the user's email. Expiration is `jwt.expiration-ms` (default 24 h). SRS §3.2.2.

### Prompt

```text
Generate com.fms.config.JwtUtil as a @Component for Spring Boot 3 using jjwt 0.11.5.

### API (PUBLIC METHODS - signatures are MANDATORY)
public String generateToken(String email)
public String extractEmail(String token)
public boolean validateToken(String token, String email)

### IMPLEMENTATION RULES
- Inject @Value("${jwt.secret}") String secret; @Value("${jwt.expiration-ms}") long expirationMs;
- Key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8))
- Algorithm: HS256 (implicit via hmacShaKeyFor)
- Subject claim = email; issuedAt = now; expiration = now + expirationMs
- validateToken: parse, compare subject to email, check not expired; on ANY JwtException return false (DO NOT throw)

### CRITICAL REMINDER
HS256 signing. Subject = email. validateToken SWALLOWS JwtException -> returns false.
```

---

## P6. Security Configuration (`SecurityConfig` + `JwtAuthFilter`)

> **MANDATORY:** The filter chain **MUST** be stateless, CSRF disabled, `/api/auth/**` permitted, everything else authenticated. The `JwtAuthFilter` extends `OncePerRequestFilter` and runs **before** `UsernamePasswordAuthenticationFilter`.

### Prompt

```text
Generate TWO files:
1) com.fms.config.SecurityConfig  (@Configuration @EnableWebSecurity)
2) com.fms.config.JwtAuthFilter   (extends OncePerRequestFilter)

### SecurityConfig
- Inject JwtAuthFilter
- @Bean PasswordEncoder -> BCryptPasswordEncoder
- @Bean AuthenticationManager from AuthenticationConfiguration
- @Bean SecurityFilterChain:
    http.csrf(c -> c.disable())
        .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))
        .authorizeHttpRequests(a -> a
            .requestMatchers("/api/auth/**").permitAll()
            .anyRequest().authenticated())
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

### JwtAuthFilter.doFilterInternal
1. Read Authorization header; if null OR !startsWith("Bearer "), chain.doFilter and return.
2. token = header.substring(7); email = jwtUtil.extractEmail(token).
3. If email != null AND SecurityContextHolder.getContext().getAuthentication() == null:
     userDetails = userDetailsService.loadUserByUsername(email);
     if jwtUtil.validateToken(token, email):
         UsernamePasswordAuthenticationToken auth = ...  (no credentials, authorities = user's)
         auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
         SecurityContextHolder.getContext().setAuthentication(auth);
4. chain.doFilter(request, response).

### CRITICAL
Stateless session. /api/auth/** is public. Filter runs BEFORE UsernamePasswordAuthenticationFilter.
Any JwtException is silently ignored — request proceeds unauthenticated.
```

---

## P7. Authentication Service & Controller

> **CRITICAL:** Passwords are hashed with `BCryptPasswordEncoder` **before** persistence. The login flow returns a JWT + basic user profile (`AuthResponse`). SRS §3.1.1, §3.1.2.

### Prompt

```text
Generate com.fms.service.AuthService (interface), com.fms.service.impl.AuthServiceImpl,
and com.fms.controller.AuthController.

### DTOs (assume already generated)
RegisterRequest { String firstName, lastName, email, password }   // validation: @NotBlank, @Email, password @Size min=8
LoginRequest    { String email, password }
AuthResponse    { String token, email, firstName, lastName }

### AuthService interface
AuthResponse register(RegisterRequest req);
AuthResponse login(LoginRequest req);

### AuthServiceImpl rules
- Inject UserRepository, PasswordEncoder, JwtUtil, AuthenticationManager.
- register:
    if userRepository.existsByEmail(req.email) -> throw new ResponseStatusException(CONFLICT, "Email already registered")
    User u = new User(...); u.setPasswordHash(passwordEncoder.encode(req.password));
    userRepository.save(u);
    String token = jwtUtil.generateToken(u.getEmail());
    return new AuthResponse(token, u.getEmail(), u.getFirstName(), u.getLastName());
- login:
    try { authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(req.email, req.password)); }
    catch (AuthenticationException e) { throw new ResponseStatusException(UNAUTHORIZED, "Invalid credentials"); }
    User u = userRepository.findByEmail(req.email).orElseThrow();
    return new AuthResponse(jwtUtil.generateToken(u.getEmail()), u.getEmail(), u.getFirstName(), u.getLastName());

### AuthController
@RestController @RequestMapping("/api/auth")
- POST /register -> @Valid @RequestBody RegisterRequest -> AuthResponse (200)
- POST /login    -> @Valid @RequestBody LoginRequest    -> AuthResponse (200)

### MANDATORY
BCrypt hash BEFORE save. Duplicate email -> 409 CONFLICT. Bad credentials -> 401 UNAUTHORIZED.
```

---

## P8. Income & Expense CRUD (Controller + Service)

> **CRITICAL:** Every query **MUST** be scoped by the authenticated user. Resolve the `User` from `SecurityContextHolder.getContext().getAuthentication().getName()` (which is the email). Never trust a `userId` from the request body. SRS §3.1.3, §3.1.4.

### Prompt

```text
Generate CRUD stacks for Income and Expense. Symmetric structure.

### For each resource X in {Income, Expense} generate:
1) XDTO (id, amount, {source|category}, date, description)  with Bean Validation
2) XService interface: list(), create(XDTO), update(Long id, XDTO), delete(Long id)  — ALL implicitly user-scoped
3) XServiceImpl: injects XRepository + UserRepository; resolves current User via
     SecurityContextHolder.getContext().getAuthentication().getName() -> email
     -> userRepository.findByEmail(email).orElseThrow(() -> new ResponseStatusException(UNAUTHORIZED));
4) XController at /api/{income|expense} with GET /, POST /, PUT /{id}, DELETE /{id}

### MANDATORY guardrails for update/delete
- Load entity by id.
- If entity.user.id != currentUser.id -> throw ResponseStatusException(FORBIDDEN, "Not your record").
- THEN apply change.

### VALIDATION
amount: @NotNull @DecimalMin("0.01")
source/category: @NotBlank
date: @NotNull @PastOrPresent

### CRITICAL REMINDER
NEVER read user_id from request body. ALWAYS resolve from SecurityContext.
Forbid cross-user access on UPDATE and DELETE.
```

---

## P9. Dashboard Service & Controller

> **MANDATORY:** Response **MUST** include totalIncome, totalExpenses, netBalance (income − expenses), and the 5 most-recent income and expense entries. SRS §3.1.5, §2.2.4.

### Prompt

```text
Generate com.fms.service.DashboardService (+ Impl) and com.fms.controller.DashboardController.

### DashboardSummaryDTO
BigDecimal totalIncome;
BigDecimal totalExpenses;
BigDecimal netBalance;          // totalIncome.subtract(totalExpenses)
List<IncomeDTO> recentIncome;    // top 5 by date desc
List<ExpenseDTO> recentExpenses; // top 5 by date desc
Map<String, BigDecimal> expenseByCategory; // from ExpenseRepository.sumByCategory

### Endpoint
GET /api/dashboard/summary -> DashboardSummaryDTO (200)

### MANDATORY
User-scoped via SecurityContext. Sums use BigDecimal.add starting from BigDecimal.ZERO.
If no data: return zeros and empty lists (NEVER null).
```

---

## P10. Tuition & Course Planner

> **CRITICAL:** Affordability formula **MUST** be:
> `totalTuition = tuitionPerCourse × numberOfCourses` > `netTuition = totalTuition − scholarshipAmount` > `affordable = (currentSavings + projectedSurplus × monthsUntilDue) ≥ netTuition`
> SRS §3.1.6.

### Prompt

```text
Generate TuitionService (+Impl), TuitionController, TuitionRequestDTO, TuitionResultDTO.

### TuitionRequestDTO
BigDecimal tuitionPerCourse (@NotNull @DecimalMin "0.00")
Integer numberOfCourses      (@NotNull @Min 1)
BigDecimal scholarshipAmount (@NotNull, default 0)
Integer monthsUntilDue       (@NotNull @Min 1)

### TuitionResultDTO
BigDecimal totalTuition;
BigDecimal netTuition;
BigDecimal projectedSavings;    // currentSavings + monthlySurplus * monthsUntilDue
boolean affordable;
String message;                 // "You can afford N courses" OR "Short by $X"

### Algorithm (MANDATORY)
monthlySurplus = dashboard.totalIncome/avgMonths - dashboard.totalExpenses/avgMonths  (use last 6 months)
currentSavings = SUM(income) - SUM(expense) for current user (BigDecimal)
projectedSavings = currentSavings + monthlySurplus.multiply(monthsUntilDue)
affordable = projectedSavings.compareTo(netTuition) >= 0
Persist TuitionPlan on every POST.

### Endpoint
POST /api/tuition/calculate -> TuitionResultDTO
```

---

## P11. Expense Prediction Service

> **CRITICAL:** Use **arithmetic mean of the last 3–6 months' expenses** grouped by month. No ML. If < 3 months of data → return HTTP 422 "Insufficient history". SRS §3.1.7.

### Prompt

```text
Generate com.fms.service.ExpensePredictionService (+Impl) and PredictionController.

### Algorithm (MANDATORY — document in Javadoc)
1. Load all expenses for current user via ExpenseRepository.
2. Group by YearMonth(date).
3. Need >= 3 distinct months of data -> else throw ResponseStatusException(UNPROCESSABLE_ENTITY, "Insufficient history").
4. Take up to the LAST 6 complete months (exclude current month).
5. monthlyTotals = list of BigDecimal per month.
6. prediction = SUM(monthlyTotals) / count(monthlyTotals), HALF_UP, 2 dp.

### Response DTO (PredictionResultDTO)
BigDecimal predictedNextMonth;
int monthsUsed;
List<MonthlyTotal> history;   // { YearMonth month, BigDecimal total }

### Endpoint
GET /api/prediction/expenses -> PredictionResultDTO

### CRITICAL REMINDER
Arithmetic mean of last 3-6 FULL months. Exclude current month. 2 decimal places, HALF_UP.
```

---

## P12. What-If Simulation Service

> **MANDATORY:** The simulation **MUST NOT** mutate stored data. It is pure projection. SRS §3.1.9.

### Prompt

```text
Generate com.fms.service.WhatIfSimulationService (+Impl) and SimulationController.

### SimulationRequestDTO
BigDecimal hypotheticalMonthlyIncome   (@NotNull @DecimalMin "0.00")
BigDecimal hypotheticalMonthlyExpenses (@NotNull @DecimalMin "0.00")
Integer projectionMonths               (@NotNull @Min 1 @Max 120)

### SimulationResultDTO
BigDecimal hypotheticalMonthlySurplus;   // income - expenses
BigDecimal projectedEndingBalance;       // currentBalance + surplus * months
List<MonthPoint> timeline;               // month index 1..N, running balance
String verdict;                          // "Surplus", "Break-even", or "Deficit"

### Algorithm
currentBalance = totalIncome - totalExpenses for the user (BigDecimal)
surplus = req.income.subtract(req.expenses)
for m = 1..projectionMonths: timeline.add(m, currentBalance + surplus*m)
verdict = compareTo(ZERO) > 0 ? "Surplus" : == 0 ? "Break-even" : "Deficit"

### Endpoint
POST /api/simulation/run -> SimulationResultDTO

### CRITICAL
DO NOT persist. DO NOT modify incomes/expenses. This is a read-only projection.
```

---

## P13. AI Financial Advisor (OpenAI integration)

> **CRITICAL:** The OpenAI call **MUST** be grounded in the current user's financial context (totals, recent entries, predicted expense). The user's plain-English question is appended as the `user` message. SRS §2.2.8, §3.1.8.

### Prompt

```text
Generate com.fms.service.AIAdvisorService (+Impl) and AIAdvisorController.

### Request / Response
AIQueryDTO { String question (@NotBlank @Size max=500) }
AIResponseDTO { String answer; List<String> dataPointsUsed; }

### Impl rules
- Inject RestTemplate (or WebClient), DashboardService, ExpensePredictionService.
- Build context string:
    "User financial snapshot:
     - Total income: $X
     - Total expenses: $Y
     - Net balance: $Z
     - Predicted next-month expenses: $P
     - Recent expenses by category: {...}"
- Call POST https://api.openai.com/v1/chat/completions with:
    Authorization: Bearer ${openai.api.key}
    model = ${openai.model}   // gpt-4o-mini
    messages = [
      { role: "system",
        content: "You are a cautious financial assistant for international students.
                  Answer ONLY using the provided financial snapshot.
                  If the data is insufficient, say so. Keep answers under 120 words." },
      { role: "user", content: contextString + "\n\nQuestion: " + question }
    ]
    temperature = 0.3
- Extract choices[0].message.content -> AIResponseDTO.answer.
- dataPointsUsed = ordered list of the snapshot lines that were non-zero / non-empty.

### Endpoint
POST /api/ai/ask -> AIResponseDTO

### CRITICAL REMINDER
Context FIRST, question SECOND. temperature=0.3. Respond gracefully (500 + message) if OpenAI call fails.
```

---

## P14. Global Exception Handler

### Prompt

```text
Generate com.fms.config.GlobalExceptionHandler (@RestControllerAdvice).

### Handle
- MethodArgumentNotValidException  -> 400, body = { field -> message } map
- ResponseStatusException          -> its status, body = { error, message, timestamp }
- ConstraintViolationException     -> 400
- Exception (catch-all)            -> 500, body = { error: "Internal server error" }

### MANDATORY
All responses are JSON. Include ISO-8601 timestamp on every error body.
Never leak stack traces to the client.
```

---

## P15. JUnit Tests (Model + Controller layer)

> **MANDATORY:** Tests **MUST** cover (a) entity validation, (b) every controller happy path, (c) authorization failures (cross-user delete = 403, no token = 401). SRS submission requirement #8.

### Prompt

```text
Generate JUnit 5 + Spring Boot Test + MockMvc tests under backend/src/test/java/com/fms.

### Required test classes
1) UserEntityTest            — @NotBlank, @Email validation via Validator.
2) IncomeEntityTest          — amount < 0.01 rejected, user reference required.
3) ExpenseEntityTest         — category @NotBlank, date @PastOrPresent.
4) AuthControllerTest        — register 200, register duplicate 409, login 200, login bad creds 401.
5) IncomeControllerTest      — GET list with JWT 200, GET without JWT 401, POST/PUT/DELETE happy path, cross-user DELETE 403.
6) ExpenseControllerTest     — same matrix as Income.
7) DashboardControllerTest   — totals correct, recentIncome size <= 5.
8) TuitionControllerTest     — affordable=true branch, affordable=false branch, short-by-X message.
9) PredictionServiceTest     — < 3 months -> 422; >= 3 months -> arithmetic mean correct to 2dp.
10) WhatIfSimulationServiceTest — surplus/deficit/break-even verdicts; timeline length == projectionMonths.

### MANDATORY
- Use @SpringBootTest + @AutoConfigureMockMvc for controller tests.
- Use @DataJpaTest for repository tests if added.
- Assert both HTTP status and JSON body (jsonPath).
- Name tests in given_when_then style: shouldReturn409_whenEmailAlreadyRegistered().

### CRITICAL REMINDER
Cover authorization (401 no-token, 403 cross-user) on EVERY protected controller.
```

---

# Part 2 — Frontend Implementation Prompts

## P16. Vite + Tailwind Scaffolding

### Prompt

```text
Generate a minimal Vite + React 18 + Tailwind CSS 3 scaffold.

### Files
- package.json with scripts: dev, build, preview. Deps: react, react-dom, react-router-dom@6, axios, recharts.
  DevDeps: vite@5, @vitejs/plugin-react, tailwindcss, postcss, autoprefixer.
- vite.config.js : react() plugin, server.port=5173.
- tailwind.config.js : content = ["./index.html","./src/**/*.{js,jsx}"], theme.extend={}.
- postcss.config.js : tailwindcss + autoprefixer.
- index.html : root div id="root", imports /src/main.jsx.
- src/main.jsx : ReactDOM.createRoot render <App />.
- src/index.css : @tailwind base/components/utilities.

### MANDATORY
Node 18+. No TypeScript. No CRA. No Next.js.
```

---

## P17. Axios Instance + AuthContext

> **CRITICAL:** The request interceptor **MUST** attach `Bearer ${token}` from `localStorage.getItem("fms_token")`. The response interceptor **MUST** catch 401 and log the user out.

### Prompt

```text
Generate src/api/axiosInstance.js and src/context/AuthContext.jsx.

### axiosInstance.js
import axios from "axios";
export const api = axios.create({ baseURL: "http://localhost:8080/api", headers: {"Content-Type":"application/json"} });
api.interceptors.request.use(cfg => {
  const t = localStorage.getItem("fms_token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
api.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401) {
    localStorage.removeItem("fms_token");
    localStorage.removeItem("fms_user");
    window.location.href = "/login";
  }
  return Promise.reject(err);
});

### AuthContext.jsx
- createContext, AuthProvider, useAuth hook.
- State: user ({email, firstName, lastName}), token.
- On mount: rehydrate from localStorage "fms_token" + "fms_user".
- login({token,email,firstName,lastName}): setUser, setToken, write to localStorage.
- logout(): clear both, redirect to /login.
- Expose: { user, token, isAuthenticated: !!token, login, logout }.

### CRITICAL
localStorage keys are EXACTLY "fms_token" and "fms_user". Nothing else.
401 -> force logout + redirect.
```

---

## P18. Router + Protected Routes

### Prompt

```text
Generate src/App.jsx with React Router v6.

### Routes
Public:
  /login              -> <LoginPage/>
  /register           -> <RegisterPage/>

Protected (wrap in <ProtectedRoute>):
  /dashboard          -> <DashboardPage/>
  /income             -> <IncomePage/>
  /expenses           -> <ExpensePage/>
  /tuition            -> <TuitionPlannerPage/>
  /prediction         -> <PredictionPage/>
  /ai-advisor         -> <AIAdvisorPage/>
  /simulation         -> <SimulationPage/>

Fallback:
  /                   -> <Navigate to="/dashboard" replace />
  *                   -> 404 component

### ProtectedRoute
const { isAuthenticated } = useAuth();
return isAuthenticated ? children : <Navigate to="/login" replace />;

### MANDATORY
Wrap everything in <AuthProvider> and <BrowserRouter>. Include <Navbar/> inside the protected branch only.
```

---

## P19. Service Layer (API call stubs)

### Prompt

```text
Generate one service file per backend resource under src/services/. Each file EXPORTS named async functions that call `api` from ../api/axiosInstance.

### authService.js
register(payload)   -> POST /auth/register   -> data
login(payload)      -> POST /auth/login      -> data
logout()            -> clears localStorage, reload /login

### incomeService.js
listIncome(), createIncome(dto), updateIncome(id,dto), deleteIncome(id)
### expenseService.js (parallel)
### dashboardService.js  — getSummary()
### tuitionService.js    — calculate(dto)
### predictionService.js — getPrediction()
### simulationService.js — runSimulation(dto)
### aiService.js         — ask(question)

### MANDATORY
All functions return `response.data` (not the full axios response).
All errors propagate (caller handles). NO try/catch inside services.
```

---

## P20. Page — LoginPage.jsx

### Prompt

```text
Generate src/pages/LoginPage.jsx as a functional component with hooks.

### Behavior
- Local state: email, password, error, loading.
- On submit: setLoading(true); try { const data = await authService.login({email,password}); auth.login(data); navigate("/dashboard"); } catch (e) { setError(e.response?.data?.message || "Login failed"); } finally { setLoading(false); }

### UI (Tailwind only)
- Centered card (max-w-md, rounded-2xl, shadow-lg, p-8)
- Heading "Sign in to FMS"
- Inputs (email, password) with labels, border-gray-300, focus:ring-2
- Submit button (bg-indigo-600, disabled:opacity-50)
- Error banner (bg-red-50 text-red-700) when error
- Link "Don't have an account? Register"

### MANDATORY
Disable submit button while loading. Clear error on new submit. DO NOT store password anywhere except local state.
```

---

## P21. Page — RegisterPage.jsx

### Prompt

```text
Generate src/pages/RegisterPage.jsx.

### Fields
firstName, lastName, email, password (min 8), confirmPassword.

### Client-side validation (before POST)
- All required.
- Valid email regex.
- password.length >= 8.
- password === confirmPassword -> else setError "Passwords do not match".

### Flow
On success: call authService.register -> auth.login(data) -> navigate /dashboard.
Map 409 response to "Email already registered".

### MANDATORY
DO NOT POST if client-side validation fails. Button disabled while loading.
```

---

## P22. Page — DashboardPage.jsx

### Prompt

```text
Generate src/pages/DashboardPage.jsx. On mount, call dashboardService.getSummary() and render.

### Layout
- Top row: three <SummaryCard/> — Total Income, Total Expenses, Net Balance (green if >=0, red if <0)
- Middle: <BudgetChart/> — Recharts BarChart of expenseByCategory (Map<String,BigDecimal>)
- Bottom: two columns — Recent Income (table), Recent Expenses (table), each max 5 rows.

### States
loading -> skeleton cards
error   -> red banner with retry button
empty   -> "No data yet — add your first income/expense"

### MANDATORY
useEffect with empty deps -> fetch once. Currency formatted via Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).
```

---

## P23. Pages — Income & Expense (CRUD)

### Prompt

```text
Generate src/pages/IncomePage.jsx and src/pages/ExpensePage.jsx. Symmetric.

### Behavior (per page)
- useEffect -> list all records.
- <IncomeForm/> or <ExpenseForm/> at top for "Add new".
- Table below: date | amount | source/category | description | [Edit] [Delete]
- Edit switches the form into update mode (pre-filled).
- Delete shows native confirm() then calls deleteX(id) then refreshes list.

### Form validation (client-side)
amount > 0.00
source/category non-empty
date <= today (no future dates)

### MANDATORY
After every successful create/update/delete, RE-FETCH the list (source of truth = server).
Toast/banner on success AND failure.
```

---

## P25. Reusable Components

### Prompt

```text
Generate these components under src/components/:

### Navbar.jsx
- Flex row: brand "FMS" (indigo-600) + links (Dashboard, Income, Expenses, Tuition, Prediction, Simulation, AI Advisor).
- Right side: "Hi, {user.firstName}" + Logout button (calls auth.logout()).
- Active link uses NavLink className with isActive -> text-indigo-600 border-b-2.

### ProtectedRoute.jsx
As specified in P18.

### SummaryCard.jsx  (props: title, value, subtitle, tone?: "positive"|"negative"|"neutral")
Rounded card, title gray-500, value 3xl bold, tone controls value color.

### BudgetChart.jsx  (props: data: [{category, amount}])
Recharts ResponsiveContainer + BarChart + XAxis(category) + YAxis + Tooltip + Bar(amount).

### IncomeForm.jsx / ExpenseForm.jsx  (props: initial?, onSubmit, onCancel?)
Controlled inputs; submit calls props.onSubmit(dto); reset on success.

### TuitionForm.jsx / SimulationForm.jsx  — same pattern.


### MANDATORY
Every form exposes an onCancel to reset state. NO component calls axios directly — go through services.
```

---

## P26. Acceptance Test Walkthrough Prompt (for screenshots/document)

> **MANDATORY:** This prompt is used to draft the textual description of the acceptance test run that ships inside the submission archive (alongside screenshots). SRS submission requirement #2.

### Prompt

```text
Produce an acceptance-test walkthrough document for the Financial Management System covering
ALL 9 functional requirements (SRS §3.1.1 … §3.1.9).

### For EACH feature include:
- Feature name (e.g., "3.1.3 Manage Income")
- Precondition (e.g., "User is logged in")
- Numbered steps (1..N) mirroring the SRS "Event Flow"
- Expected result per step
- Screenshot placeholder tag: [SCREENSHOT: <short_name>.png]
- Post-condition (matches SRS)

### MANDATORY ordering
1. Create Account
2. Login
3. Manage Income
4. Manage Expenses
5. View Budget Dashboard
6. Tuition & Course Planner
7. Expense Prediction
8. AI Financial Advisor
9. What-If Simulation

### CRITICAL REMINDER
Every screenshot placeholder MUST sit on its own line so screenshots can be inserted later.
Every feature MUST end with the literal line "PASS / FAIL: ___".
```

---

# Part 3 — Cross-Cutting Prompt Principles (summary)

> **Repeated at the end per the Sandwich Method.** These apply to every prompt in Parts 1 & 2:
>
> 1. **Never invent fields.** Use exactly the entity and DTO shapes defined in P3 and the DTOs listed per controller.
> 2. **User scoping is non-negotiable.** Every data access goes through `SecurityContext` → email → `User`. Never trust a client-supplied user id.
> 3. **Money is `BigDecimal`.** Never `double`, never `float`. Scale = 2, rounding = `HALF_UP`.
> 4. **JWT is stateless.** No server-side session storage. `/api/auth/**` is the only public path.
> 5. **Frontend never calls axios directly from a component.** Components → services → `api`.
> 6. **Secrets are placeholders.** `jwt.secret`, `openai.api.key`, DB password are never real values in source.
> 7. **Errors are structured.** Backend returns `{ error, message, timestamp }`; frontend reads `response.data.message`.
> 8. **Tests cover auth failures.** Every protected endpoint has a 401 (no token) and a 403 (wrong user) test.

---

_End of Prompts.md — Financial Management System, CS 5394 Group 2._
