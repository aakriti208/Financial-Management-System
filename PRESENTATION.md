# Numo — Financial Management System
### Presentation Notes

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Recharts, React Router, Axios |
| **Backend** | Java 17, Spring Boot 3.2, Spring Security, Spring Data JPA |
| **Database** | PostgreSQL 15 with pgvector extension |
| **Authentication** | JWT (stateless, BCrypt password hashing) |
| **AI / LLM** | Groq API — Llama 3.3 70B via OpenAI-compatible endpoint |
| **Build Tools** | Maven (backend), Vite (frontend) |
| **Testing** | JUnit 5 + Mockito (backend), Vitest + Testing Library (frontend) |

---

## 2. Development Cycle

1. **Planning** — Defined user stories around international student financial pain points (scholarships, tuition, budgeting)
2. **Architecture** — Designed MVC backend with RESTful API; React SPA frontend with JWT auth
3. **Core Build** — Auth → Income/Expense CRUD → Dashboard → Prediction → AI Advisor → Tuition Planner
4. **AI Integration** — Integrated Groq LLM with prompt engineering using live user financial data
5. **Testing** — Unit tests for services and controllers; component tests for frontend
6. **Iterative Fixes** — Debugged pgvector startup failures, fixed JWT principal binding, resolved CORS and `/error` endpoint security issues

---

## 3. MVC Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Frontend (View)                  │
│  React Pages: Dashboard, Expenses, Income,           │
│  Tuition Planner, Prediction, AI Advisor             │
│  Components: Navbar, AIChat, AIChatWidget, Charts    │
└────────────────────┬────────────────────────────────┘
                     │ HTTP (Axios + JWT)
┌────────────────────▼────────────────────────────────┐
│                  Controllers (REST API)              │
│  AuthController  DashboardController                 │
│  IncomeController  ExpenseController                 │
│  PredictionController  AIAdvisorController           │
│  TuitionController  SimulationController             │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│                    Services (Business Logic)         │
│  AuthService  DashboardService  PredictionService    │
│  IncomeService  ExpenseService  AIAdvisorService     │
│  TuitionService  EmbeddingService                    │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│                 Models + Repositories                │
│  User  Expense  Income  TuitionPlan                  │
│  JPA Repositories → PostgreSQL                       │
└─────────────────────────────────────────────────────┘
```

**Models:** `User`, `Expense` (with `ExpenseType`, `Necessity`), `Income` (with `IncomeSourceType`), `TuitionPlan`

**Security Layer:** `JwtAuthenticationFilter` runs on every request — validates Bearer token and injects user email as the Spring Security principal.

---

## 4. Core Features

- **User Auth** — Register/login with JWT; all data is user-scoped
- **Income Tracking** — Log income with source types: Scholarship, Assistantship, Part-time Work, Family Support
- **Expense Tracking** — Dual classification per entry: Fixed/Variable + Essential/Discretionary
- **Dashboard** — All-time totals, 5 most recent transactions, 6-month income vs. expense chart
- **Expense Prediction** — Forecast next month's spending per category using a moving average algorithm
- **Tuition Planner** — Calculates affordability based on savings, surplus, and scholarship deductions
- **AI Financial Advisor** — Chat interface (widget on every page) powered by Llama 3.3 70B with real financial data in context

---

## 5. Key Algorithms

### Expense Prediction (Moving Average)
```
Lookback = last 6 months of expenses
For each category:
  predicted_amount = total_spent / distinct_months_appeared
  predicted_type   = most frequent ExpenseType
  predicted_need   = most frequent Necessity
Output sorted by predicted amount (descending)
```

### Tuition Affordability
```
net_tuition     = (courses × cost_per_course) − scholarship  [min $0]
current_savings = max(all-time income − all-time expenses, 0)
monthly_surplus = average(monthly net over last 6 months)

if savings ≥ net_tuition       → Affordable now
elif monthly_surplus ≤ 0       → Not affordable — reduce expenses
else                           → months_needed = ceil(gap / surplus)
```

### Dashboard Monthly Breakdown
```
For each of the last 6 calendar months:
  income_total   = SUM of income records in that month
  expense_total  = SUM of expense records in that month
  label          = 3-letter month abbreviation (e.g. "Apr")
```

---

## 6. Testing Strategies

### Backend — Unit Tests (JUnit 5 + Mockito)
- **Service layer** mocked with `@Mock` repositories — tests business logic in isolation
- **Controller layer** tested with `MockMvc` — verifies HTTP status codes and JSON responses
- **JWT utility** — token generation, validation, and claims extraction
- Key test files: `DashboardServiceImplTest`, `ExpenseServiceImplTest`, `IncomeServiceImplTest`, `AuthServiceImplTest`, `DashboardControllerTest`, `JwtUtilTest`

### Frontend — Component Tests (Vitest + Testing Library)
- `SummaryCard.test.jsx` — renders correctly with given props
- `LoginPage.test.jsx` — form input and submission validation
- `authService.test.js` — API call stubbing with mocked Axios

### Strategy Summary
| Layer | Tool | Approach |
|---|---|---|
| Services | JUnit 5 + Mockito | Mock dependencies, test logic |
| Controllers | MockMvc | Test HTTP layer end-to-end |
| Frontend | Vitest + Testing Library | Render + interact components |

---

## 7. Prompt Engineering

The AI Advisor uses **context-augmented prompting** — the user's live financial data is injected into the system prompt before every query.

### System Prompt Structure
```
You are a personal financial advisor for an international student.
Answer based only on the user's actual financial data provided below.
Be concise, empathetic, and specific. Use dollar amounts when referring to records.

=== FINANCIAL SUMMARY ===
Total Income  (all-time): $[X]
Total Expenses (all-time): $[X]
Net Balance:              $[X]

=== RECENT EXPENSE RECORDS ===
- [Category]: $[Amount] | [Fixed/Variable] | [Essential/Discretionary] | [Date]
... (10 most recent)

=== RECENT INCOME RECORDS ===
- [Source]: $[Amount] | [Type] | [Date]
... (10 most recent)
```

### Model Configuration
| Parameter | Value |
|---|---|
| Model | `llama-3.3-70b-versatile` (via Groq) |
| Max tokens | 800 |
| Temperature | 0.7 |
| Endpoint | OpenAI-compatible Chat Completions |

### Why This Approach
- Grounds responses in the user's **actual data** — prevents hallucination of generic advice
- Role framing ("international student") tailors tone and context
- Structured sections (Summary, Expenses, Income) ensure the model can reason over all data types

---

## 8. Summary & Conclusion

**Numo** is a full-stack financial management web app built specifically for international students managing multi-source income (scholarships, stipends, family support) and categorized spending.

### What Was Built
- Secure JWT-authenticated REST API (Spring Boot) + React SPA
- Real-time financial dashboard with historical charts
- Statistical expense prediction using moving averages
- Tuition affordability planner with savings-based projections
- AI financial advisor chatbot available on every page, grounded in the user's real data

### Key Technical Decisions
- **Stateless JWT auth** — scales horizontally, no server-side session storage
- **Dual expense classification** (type + necessity) — richer data for analysis and AI context
- **Groq/Llama over OpenAI** — free tier, fast inference, OpenAI-compatible API
- **Context-augmented prompting** — real user data in every AI query ensures relevant, personalized answers

### Limitations & Future Work
- RAG (vector similarity search) infrastructure is in place but not active — would improve AI relevance at scale
- What-If Simulation feature is scaffolded but not implemented
- No CI/CD pipeline currently; would benefit from GitHub Actions automation
- Production deployment would require environment-based secret management
