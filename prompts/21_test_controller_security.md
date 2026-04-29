# Prompt 21 — Controller & Security Tests
**Phase:** Testing

---

## Context
Writing controller-layer tests using MockMvc. The key scenarios to cover are: endpoints return the right HTTP status, JWT authentication is enforced on all protected routes, cross-user access is denied, and validation errors return 400 with a readable message.

---

## Prompt

```
Generate Spring Boot MockMvc controller tests for the FMS application.
Use @SpringBootTest + @AutoConfigureMockMvc. Mock service layer with @MockBean.
Generate a JwtUtil helper in tests to create valid tokens for test users.

---

### Test Setup (shared across all controller tests)

@BeforeEach:
  - Create a test user: email="test@fms.dev", id=1L
  - Generate a valid JWT for this user using JwtUtil (inject the real bean)
  - Create an "other user" token for cross-user tests: email="other@fms.dev", id=2L

Helper method:
  private MockHttpServletRequestBuilder withJwt(MockHttpServletRequestBuilder req, String token)
  -> req.header("Authorization", "Bearer " + token)

---

### AuthControllerTest

shouldReturn201_whenRegisterWithValidPayload
  POST /api/auth/register
  Body: { firstName, lastName, email, password (>=8 chars) }
  Mock authService.register() returning AuthResponse
  Assert: status 201, response has "token" field

shouldReturn400_whenRegisterWithShortPassword
  Body: { password: "short" }
  Assert: status 400, body contains validation error message

shouldReturn200_whenLoginWithValidCredentials
  POST /api/auth/login
  Mock authService.login() returning AuthResponse
  Assert: status 200, body has "token", "email", "firstName", "lastName"

shouldReturn403_whenLoginWithWrongPassword
  Mock authService.login() throwing RuntimeException
  Assert: status 4xx (not 200)

---

### ExpenseControllerTest

shouldReturn200_whenGetExpenses_withValidJwt
  GET /api/expenses with valid JWT
  Mock expenseService.getAllExpenses() returning list of 3 DTOs
  Assert: status 200, body is JSON array of size 3

shouldReturn403_whenGetExpenses_withoutJwt
  GET /api/expenses — no Authorization header
  Assert: status 403

shouldReturn201_whenCreateExpense_withValidBody
  POST /api/expenses with valid JWT
  Body: { amount: 150.00, category: "Food", expenseType: "VARIABLE",
          necessity: "ESSENTIAL", date: "2026-04-01" }
  Mock expenseService.createExpense() returning DTO
  Assert: status 201

shouldReturn400_whenCreateExpense_withNegativeAmount
  Body: { amount: -50.00, ... }
  Assert: status 400, body contains "amount" validation message

shouldReturn204_whenDeleteExpense_withValidJwt
  DELETE /api/expenses/1 with valid JWT
  Mock expenseService.deleteExpense() (void)
  Assert: status 204

shouldReturn403_whenDeleteExpense_withoutJwt
  DELETE /api/expenses/1 — no JWT
  Assert: status 403

---

### IncomeControllerTest (parallel to ExpenseControllerTest)
Same test matrix applied to GET/POST/DELETE /api/income

---

### DashboardControllerTest

shouldReturn200_withCorrectSummaryShape
  GET /api/dashboard/summary with valid JWT
  Mock dashboardService.getSummary() returning DashboardSummaryDTO with known values
  Assert: status 200
  Assert jsonPath: $.totalIncome, $.totalExpenses, $.netBalance, $.recentIncome, $.recentExpenses, $.monthlyData all present

shouldReturn403_withoutJwt
  GET /api/dashboard/summary — no JWT
  Assert: status 403

---

### AIAdvisorControllerTest

shouldReturn200_withValidJwtAndQuestion
  POST /api/ai/ask with valid JWT
  Body: { question: "Am I saving enough?" }
  Mock aiAdvisorService.ask() returning AIResponseDTO { answer: "Yes, you are.", model: "llama-3.3-70b-versatile" }
  Assert: status 200
  Assert jsonPath: $.answer == "Yes, you are."

shouldReturn400_whenQuestionIsBlank
  Body: { question: "" }
  Assert: status 400

shouldReturn403_withoutJwt
  POST /api/ai/ask — no JWT
  Assert: status 403

---

### JwtUtilTest

shouldGenerateAndValidateToken
  token = jwtUtil.generateToken("user@test.com")
  Assert: jwtUtil.validateToken(token) == true

shouldExtractCorrectEmail
  token = jwtUtil.generateToken("user@test.com")
  Assert: jwtUtil.extractEmail(token).equals("user@test.com")

shouldReturnFalse_forTamperedToken
  Tamper last 3 chars of token
  Assert: jwtUtil.validateToken(tamperedToken) == false

shouldReturnFalse_forExpiredToken
  Use reflection or a short expiry to create an already-expired token
  Assert: jwtUtil.validateToken(expiredToken) == false

### Conventions:
- Use jsonPath("$.fieldName") for response body assertions
- Use status().isOk(), status().isCreated(), status().isForbidden() etc.
- Content type: MediaType.APPLICATION_JSON for all POST/PUT requests
```
