# Financial Management System (FMS)

A web application for international students to track income, manage expenses, plan tuition costs, predict future spending, and get AI-powered financial advice.

---

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Backend  | Java 17, Spring Boot 3, Maven       |
| Frontend | React 18, Vite, Tailwind CSS        |
| Database | PostgreSQL                          |
| Auth     | JWT (stateless, via jjwt)           |
| Charts   | Recharts                            |
| AI       | OpenAI Chat Completions API         |

---

## Project Structure

```
Financial-Management-System/
├── backend/                        # Spring Boot Maven project
│   └── src/main/java/com/fms/
│       ├── FmsApplication.java
│       ├── config/                 # SecurityConfig, JwtUtil, CorsConfig
│       ├── controller/             # REST controllers (8 controllers)
│       ├── dto/                    # Request/Response DTOs (12 classes)
│       ├── model/                  # JPA entities (User, Income, Expense, TuitionPlan)
│       ├── repository/             # Spring Data JPA repositories
│       └── service/                # Service interfaces + implementations
│
└── frontend/                       # React + Vite app
    └── src/
        ├── api/                    # Axios instance with JWT interceptor
        ├── components/             # Reusable UI components
        ├── context/                # AuthContext (JWT + user state)
        ├── pages/                  # One file per route/page
        └── services/               # API call stubs (one per backend resource)
```

---

## Getting Started

### Prerequisites

- Java 17+
- Maven 3.9+
- Node.js 18+ and npm
- PostgreSQL 15+

### 1. Database Setup

```sql
CREATE DATABASE fms_db;
```

### 2. Backend

**Configure environment variables** — edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/fms_db
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD
jwt.secret=REPLACE_WITH_LONG_RANDOM_STRING_MIN_32_CHARS
openai.api.key=YOUR_OPENAI_API_KEY
```

**Run:**

```bash
cd backend
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## API Endpoints

| Method | Endpoint                    | Description                    | Auth |
|--------|-----------------------------|--------------------------------|------|
| POST   | /api/auth/register          | Register a new user            | No   |
| POST   | /api/auth/login             | Login, receive JWT             | No   |
| GET    | /api/income                 | List all income records        | Yes  |
| POST   | /api/income                 | Add income record              | Yes  |
| PUT    | /api/income/{id}            | Update income record           | Yes  |
| DELETE | /api/income/{id}            | Delete income record           | Yes  |
| GET    | /api/expense                | List all expenses              | Yes  |
| POST   | /api/expense                | Add expense record             | Yes  |
| PUT    | /api/expense/{id}           | Update expense record          | Yes  |
| DELETE | /api/expense/{id}           | Delete expense record          | Yes  |
| GET    | /api/dashboard/summary      | Get dashboard summary          | Yes  |
| POST   | /api/tuition/calculate      | Calculate tuition cost         | Yes  |
| GET    | /api/prediction/expenses    | Get expense predictions        | Yes  |
| POST   | /api/ai/ask                 | Ask AI financial advisor       | Yes  |
| POST   | /api/simulation/run         | Run what-if simulation         | Yes  |

---

## Environment Variables

| Variable                    | Location                    | Description                           |
|-----------------------------|-----------------------------|---------------------------------------|
| `spring.datasource.url`     | application.properties      | PostgreSQL JDBC URL                   |
| `spring.datasource.username`| application.properties      | DB username                           |
| `spring.datasource.password`| application.properties      | DB password                           |
| `jwt.secret`                | application.properties      | JWT signing key (min 32 characters)   |
| `jwt.expiration-ms`         | application.properties      | Token TTL in ms (default: 86400000)   |
| `openai.api.key`            | application.properties      | OpenAI API key for AI Advisor feature |

---

## Suggested Work Split (3 Developers)

### Developer 1 — Authentication & Core Infrastructure
**Backend:**
- Implement `AuthService` / `AuthServiceImpl` (register, login)
- Implement `JwtUtil` (generateToken, validateToken, extractEmail)
- Wire up `JwtAuthenticationFilter` and complete `SecurityConfig`
- Implement `UserRepository` queries

**Frontend:**
- `LoginPage`, `RegisterPage`
- `AuthContext` (restore user from token on refresh)
- `authService.js` (register, login, logout)
- `ProtectedRoute` and `axiosInstance.js` 401 interceptor

---

### Developer 2 — Income, Expenses & Dashboard
**Backend:**
- Implement `IncomeServiceImpl` (CRUD)
- Implement `ExpenseServiceImpl` (CRUD)
- Implement `DashboardServiceImpl` (aggregate totals, recent transactions)

**Frontend:**
- `IncomePage`, `ExpensePage`, `DashboardPage`
- `IncomeForm`, `ExpenseForm`, `SummaryCard`, `BudgetChart`
- `incomeService.js`, `expenseService.js`, `dashboardService.js`

---

### Developer 3 — AI, Prediction, Simulation & Tuition
**Backend:**
- Implement `TuitionServiceImpl` (calculation logic)
- Implement `ExpensePredictionServiceImpl` (moving-average algorithm)
- Implement `AIAdvisorServiceImpl` (OpenAI API integration)
- Implement `WhatIfSimulationServiceImpl` (projection loop)

**Frontend:**
- `TuitionPlannerPage`, `PredictionPage`, `AIAdvisorPage`, `SimulationPage`
- `TuitionForm`, `SimulationForm`, `AIChat`
- `tuitionService.js`, `predictionService.js`, `aiService.js`, `simulationService.js`

---

## Development Notes

- Every service method currently returns `null` with a `// TODO` comment — that is intentional. Fill in business logic as you implement each feature.
- JWT filter (`JwtAuthenticationFilter`) is not yet created — it must be added to `SecurityConfig` for protected endpoints to work.
- Hibernate `ddl-auto=update` will auto-create tables on first run. Switch to `validate` or use Flyway/Liquibase migrations for production.
- The OpenAI API key is required only for the AI Advisor feature; all other features work without it.
