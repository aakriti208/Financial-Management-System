# Prompt 04 — Income & Expense CRUD
**Phase:** Core Features

---

## Context
Auth is working. Now building the core data entry features — logging income and expenses. Every query must be scoped to the authenticated user resolved from the JWT, never from the request body.

---

## Prompt

```
Generate full CRUD stacks for Income and Expense resources.
Backend: Spring Boot 3.2, package com.fms.

Both stacks are symmetric. Generate for each:
  - DTO
  - Service interface
  - ServiceImpl
  - Controller

---

### IncomeDTO (com.fms.dto)
Fields: Long id, BigDecimal amount, String source, IncomeSourceType sourceType,
        LocalDate date, String description

### IncomeService interface
List<IncomeDTO> getAllIncome()
IncomeDTO createIncome(IncomeDTO dto)
IncomeDTO updateIncome(Long id, IncomeDTO dto)
void deleteIncome(Long id)

### IncomeServiceImpl
- Inject IncomeRepository, UserRepository
- Resolve current user: SecurityContextHolder -> authentication.getName() -> email
  -> userRepository.findByEmail(email).orElseThrow(...)
- getAllIncome: findByUserOrderByDateDesc(user), map to DTOs
- createIncome: build Income entity from dto, set user, save, return DTO
- updateIncome: load by id, verify entity.user.id == currentUser.id else throw 403,
  apply changes, save
- deleteIncome: same ownership check then delete

### IncomeController at /api/income
GET    /        -> getAllIncome()      -> 200
POST   /        -> createIncome()     -> 201
PUT    /{id}    -> updateIncome()     -> 200
DELETE /{id}    -> deleteIncome()     -> 204

---

### ExpenseDTO (com.fms.dto)
Fields: Long id, BigDecimal amount, String category,
        ExpenseType expenseType, Necessity necessity,
        LocalDate date, String description

### ExpenseService + ExpenseServiceImpl + ExpenseController at /api/expenses
Exact same CRUD structure as Income above.
Map fields to Expense entity (category, expenseType, necessity instead of source, sourceType).

---

### RULES (apply to both)
- NEVER read userId from the request body — ALWAYS resolve from SecurityContext
- On update/delete: if entity does not belong to current user -> throw ResponseStatusException(FORBIDDEN)
- Return DTOs, never raw entities
- All amounts are BigDecimal — never cast to double
```
