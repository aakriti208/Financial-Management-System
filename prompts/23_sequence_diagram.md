# Prompt 23 — Sequence Diagrams
**Phase:** Documentation / Diagrams

---

## Context
Sequence diagrams for the three most important flows in the application: the login flow (showing JWT generation), the expense creation flow (showing auth filter and persistence), and the AI advisor query flow (showing prompt construction and Groq API call).

---

## Prompt

```
Generate three UML sequence diagrams in PlantUML syntax.

---

## DIAGRAM 1 — User Login Flow

Participants: Browser, React LoginPage, authService, Axios, AuthController, AuthServiceImpl, UserRepository, JwtUtil, AuthContext, localStorage

Sequence:
1. User -> LoginPage: enters email + password, clicks Sign In
2. LoginPage -> authService: login({ email, password })
3. authService -> Axios: POST /api/auth/login with body
4. Axios -> AuthController: HTTP POST /api/auth/login
5. AuthController -> AuthServiceImpl: login(LoginRequest)
6. AuthServiceImpl -> UserRepository: findByEmail(email)
7. UserRepository -> AuthServiceImpl: Optional<User>
8. AuthServiceImpl -> AuthServiceImpl: BCrypt.matches(password, passwordHash)
9. AuthServiceImpl -> JwtUtil: generateToken(email)
10. JwtUtil -> AuthServiceImpl: JWT string
11. AuthServiceImpl -> AuthController: AuthResponse { token, email, firstName, lastName }
12. AuthController -> Axios: 200 OK + AuthResponse JSON
13. Axios -> authService: response.data
14. authService -> localStorage: setItem("token", jwt)
15. authService -> LoginPage: AuthResponse
16. LoginPage -> AuthContext: login(userData, token)
17. AuthContext -> localStorage: setItem("user", JSON)
18. LoginPage -> Browser: navigate("/dashboard")

---

## DIAGRAM 2 — Expense Creation Flow (showing JWT auth)

Participants: Browser, React ExpensePage, expenseService, Axios (interceptor), JwtAuthenticationFilter, ExpenseController, ExpenseServiceImpl, UserRepository, ExpenseRepository

Sequence:
1. User -> ExpensePage: fills form and clicks Save
2. ExpensePage -> expenseService: createExpense(dto)
3. expenseService -> Axios: POST /api/expenses with dto
4. Axios interceptor -> Axios: attach Authorization: Bearer <token> from localStorage
5. Axios -> JwtAuthenticationFilter: HTTP POST /api/expenses + Bearer token
6. JwtAuthenticationFilter -> JwtUtil: validateToken(token)
7. JwtUtil -> JwtAuthenticationFilter: true
8. JwtAuthenticationFilter -> JwtUtil: extractEmail(token)
9. JwtUtil -> JwtAuthenticationFilter: "user@fms.dev"
10. JwtAuthenticationFilter -> SecurityContext: setAuthentication(email)
11. JwtAuthenticationFilter -> ExpenseController: forward request (authenticated)
12. ExpenseController -> ExpenseServiceImpl: createExpense(dto)
13. ExpenseServiceImpl -> SecurityContext: getAuthentication().getName() -> email
14. ExpenseServiceImpl -> UserRepository: findByEmail(email) -> User
15. ExpenseServiceImpl -> ExpenseRepository: save(expenseEntity)
16. ExpenseRepository -> ExpenseServiceImpl: saved Expense
17. ExpenseServiceImpl -> ExpenseController: ExpenseDTO
18. ExpenseController -> Axios: 201 Created + ExpenseDTO
19. Axios -> expenseService: response.data
20. expenseService -> ExpensePage: ExpenseDTO
21. ExpensePage -> Browser: re-fetch list, show success banner

---

## DIAGRAM 3 — AI Advisor Query Flow

Participants: Browser, AIChatWidget, AIChat, aiService, Axios, AIAdvisorController, AIAdvisorServiceImpl, ExpenseRepository, IncomeRepository, DashboardService, OpenAIClient, GroqAPI

Sequence:
1. User -> AIChatWidget: clicks "Ask Numo" button
2. AIChatWidget -> AIChatWidget: setOpen(true)
3. User -> AIChat: types question, clicks Send
4. AIChat -> aiService: askQuestion("Am I saving enough?")
5. aiService -> Axios: POST /api/ai/ask { question }
6. Axios -> AIAdvisorController: HTTP POST (with JWT)
7. AIAdvisorController -> AIAdvisorServiceImpl: ask(email, AIQueryDTO)
8. AIAdvisorServiceImpl -> ExpenseRepository: findByUserOrderByDateDesc(user) -> 10 records
9. AIAdvisorServiceImpl -> IncomeRepository: findByUserOrderByDateDesc(user) -> 10 records
10. AIAdvisorServiceImpl -> DashboardService: getSummary(email) -> totals
11. AIAdvisorServiceImpl -> AIAdvisorServiceImpl: buildSystemPrompt(summary, expenses, incomes)
12. AIAdvisorServiceImpl -> OpenAIClient: chat(systemPrompt, question)
13. OpenAIClient -> GroqAPI: POST https://api.groq.com/openai/v1/chat/completions
14. GroqAPI -> OpenAIClient: 200 OK { choices[0].message.content }
15. OpenAIClient -> AIAdvisorServiceImpl: answer string
16. AIAdvisorServiceImpl -> AIAdvisorController: AIResponseDTO { answer, model }
17. AIAdvisorController -> Axios: 200 OK + AIResponseDTO
18. Axios -> aiService: response.data
19. aiService -> AIChat: { answer, model }
20. AIChat -> Browser: append AI message bubble, scroll to bottom

### Diagram style:
- Use activate/deactivate for showing processing time on long operations
- Add a note over the Axios interceptor step explaining JWT attachment
- Add a note over the buildSystemPrompt step showing the prompt structure
- Use -> for synchronous calls, ->> for async/fire-and-forget
```
