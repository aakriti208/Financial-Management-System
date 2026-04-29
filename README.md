# Financial Management System (FMS)

A specialized web application designed for international students to bridge the gap between daily spending and long-term academic financial planning.

---

## Tech Stack

| Layer    | Technology                    |
| -------- | ----------------------------- |
| Backend  | Java 17, Spring Boot 3, Maven |
| Frontend | React 18, Vite, Tailwind CSS  |
| Database | PostgreSQL                    |
| Auth     | JWT (stateless, via jjwt)     |
| Charts   | Recharts                      |
| AI       | OpenAI Chat Completions API   |

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
