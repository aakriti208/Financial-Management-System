# Prompt 14 — UML Class Diagram (Backend)
**Phase:** Documentation / Diagrams

---

## Context
Need a full UML class diagram of the backend showing all entities, DTOs, services, controllers, and their relationships. Used for the project report and presentation.

---

## Prompt

```
Generate a UML class diagram in PlantUML syntax for the FMS Spring Boot backend.

### Include the following classes and their fields + methods:

#### Entities (com.fms.model)
- User: id, firstName, lastName, email, passwordHash, createdAt
- Expense: id, amount, category, expenseType, necessity, date, description + ManyToOne User
- Income: id, amount, source, sourceType, date, description + ManyToOne User
- TuitionPlan: id, tuitionPerCourse, numberOfCourses, scholarshipAmount, createdAt + ManyToOne User
- Enums: ExpenseType {FIXED, VARIABLE}, Necessity {ESSENTIAL, DISCRETIONARY},
         IncomeSourceType {SCHOLARSHIP, ASSISTANTSHIP, PART_TIME_WORK, FAMILY_SUPPORT, OTHER}

#### DTOs (com.fms.dto)
- ExpenseDTO, IncomeDTO, DashboardSummaryDTO, MonthlyDataDTO
- AuthResponse, LoginRequest, RegisterRequest
- AIQueryDTO, AIResponseDTO
- TuitionRequestDTO, TuitionResultDTO

#### Service Interfaces (com.fms.service)
- AuthService: register(), login()
- ExpenseService: getAllExpenses(), createExpense(), updateExpense(), deleteExpense()
- IncomeService: getAllIncome(), createIncome(), updateIncome(), deleteIncome()
- DashboardService: getSummary()
- ExpensePredictionService: predictNextMonthExpenses()
- AIAdvisorService: ask()
- TuitionService: calculate()
- EmbeddingService: embedExpenseAsync(), embedIncomeAsync()

#### Controllers (com.fms.controller)
- AuthController -> uses AuthService
- ExpenseController -> uses ExpenseService
- IncomeController -> uses IncomeService
- DashboardController -> uses DashboardService
- PredictionController -> uses ExpensePredictionService
- AIAdvisorController -> uses AIAdvisorService
- TuitionController -> uses TuitionService

#### Config / Infrastructure
- JwtUtil: generateToken(), extractEmail(), validateToken()
- JwtAuthenticationFilter -> uses JwtUtil
- OpenAIClient: chat()
- SecurityConfig -> uses JwtAuthenticationFilter

### Relationships to show:
- User "1" --> "many" Expense
- User "1" --> "many" Income
- User "1" --> "many" TuitionPlan
- Each Controller "uses" its Service (dashed dependency arrow)
- Each ServiceImpl "implements" its interface
- Each ServiceImpl "uses" its Repository
- AIAdvisorServiceImpl "uses" OpenAIClient
- JwtAuthenticationFilter "uses" JwtUtil

### Diagram rules:
- Group classes by package using namespaces or packages blocks
- Show only the most important fields and methods (not getters/setters)
- Use proper UML notation: + for public, - for private, # for protected
- Show <<interface>> stereotype for service interfaces
- Show <<entity>> stereotype for JPA models
- Show <<DTO>> stereotype for data transfer objects
```
