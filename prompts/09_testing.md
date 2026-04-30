# Prompt 09 — Unit & Integration Tests
**Phase:** Testing

---

## Context
All features are built. Writing tests before the presentation review. Backend tests use JUnit 5 + Mockito with mocked repositories. Controller tests use MockMvc. Frontend tests use Vitest + React Testing Library.

---

## Prompt

```
Generate unit and controller tests for the FMS application.

---

## BACKEND TESTS (JUnit 5 + Mockito + MockMvc)
Package: com.fms (test root)

### DashboardServiceImplTest
Mock: IncomeRepository, ExpenseRepository, UserRepository
Test cases:
- getSummary_returnsTotalsCorrectly: income=[500,300], expenses=[200], net=600
- getSummary_recentIncomeLimitedToFive: save 7 income records, assert recentIncome.size() == 5
- getSummary_returnsEmptyListsNotNull_whenNoData
- getSummary_monthlyDataHasSixEntries
- getSummary_monthLabelIsThreeLetterAbbreviation (e.g. "Jan", "Feb")

### ExpenseServiceImplTest
Mock: ExpenseRepository, UserRepository
Test cases:
- getAllExpenses_returnsMappedDTOs
- createExpense_savesEntityAndReturnsDTO
- updateExpense_throwsForbidden_whenUserMismatch
- deleteExpense_throwsForbidden_whenUserMismatch
- createExpense_throwsException_whenUserNotFound

### IncomeServiceImplTest (parallel structure to ExpenseServiceImplTest)

### AuthServiceImplTest
Mock: UserRepository, PasswordEncoder, JwtUtil
Test cases:
- register_savesUserWithHashedPassword
- register_throwsException_whenEmailAlreadyExists
- login_returnsToken_withValidCredentials
- login_throwsException_withWrongPassword
- login_throwsException_whenUserNotFound

### DashboardControllerTest (@SpringBootTest + MockMvc)
- GET /api/dashboard/summary with valid JWT -> 200 + correct JSON shape
- GET /api/dashboard/summary without JWT -> 403

### ExpenseControllerTest
- POST /api/expenses with valid JWT and valid body -> 201
- GET /api/expenses with valid JWT -> 200 with list
- DELETE /api/expenses/{id} with valid JWT -> 204
- DELETE /api/expenses/{id} without JWT -> 403

### IncomeControllerTest (parallel to Expense)

### JwtUtilTest
- generateToken_producesValidToken
- extractEmail_returnsCorrectEmail
- validateToken_returnsFalse_forExpiredToken
- validateToken_returnsFalse_forTamperedToken

---

## FRONTEND TESTS (Vitest + React Testing Library)
Under frontend/src/__tests__/

### SummaryCard.test.jsx
- renders title and value correctly
- applies green class when tone is positive
- applies red class when tone is negative

### LoginPage.test.jsx
- renders email and password inputs
- shows error message when login fails
- disables submit button while loading

### authService.test.js
- login calls POST /auth/login with correct payload
- register calls POST /auth/register with correct payload
- login stores token in localStorage on success

---

## TEST CONVENTIONS
- Backend: given_when_then naming: shouldReturn403_whenNoJwtProvided()
- Use @Mock + @InjectMocks for service tests
- Use @SpringBootTest + @AutoConfigureMockMvc for controller tests
- Frontend: describe/it blocks, descriptive test names
- Assert both HTTP status AND response body (jsonPath for backend, getByText/getByRole for frontend)
```
