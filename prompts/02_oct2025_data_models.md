# Prompt 02 — JPA Entities & Repositories
**Phase:** Data Layer

---

## Context
Scaffold is working. Now defining the core data models. The app tracks users, their income, expenses, and tuition plans. All money fields must be BigDecimal — never double.

---

## Prompt

```
Generate four JPA entity classes in package com.fms.model for a Spring Boot 3 + Hibernate 6 app.
Use Lombok (@Data, @NoArgsConstructor, @AllArgsConstructor, @Builder where appropriate).

### ENTITY: User (table: users)
Fields:
- id: Long, @Id @GeneratedValue(IDENTITY)
- firstName, lastName: String, @NotBlank
- email: String, unique=true, @Email, @Column(unique=true)
- passwordHash: String (never expose in JSON — @JsonIgnore)
- createdAt: Instant, default Instant.now()

### ENTITY: Income (table: income)
Fields:
- id: Long
- amount: BigDecimal, @Column(precision=12, scale=2), @DecimalMin("0.01")
- source: String, @NotBlank
- sourceType: enum IncomeSourceType {SCHOLARSHIP, ASSISTANTSHIP, PART_TIME_WORK, FAMILY_SUPPORT, OTHER}
- date: LocalDate, @NotNull
- description: String, nullable
- user: @ManyToOne(fetch=LAZY), @JoinColumn(name="user_id", nullable=false)

### ENTITY: Expense (table: expenses)
Fields:
- id: Long
- amount: BigDecimal, @Column(precision=12, scale=2), @DecimalMin("0.01")
- category: String, @NotBlank
- expenseType: enum ExpenseType {FIXED, VARIABLE}
- necessity: enum Necessity {ESSENTIAL, DISCRETIONARY}
- date: LocalDate, @NotNull
- description: String, nullable
- user: @ManyToOne(fetch=LAZY), @JoinColumn(name="user_id", nullable=false)

### ENTITY: TuitionPlan (table: tuition_plans)
Fields:
- id: Long
- tuitionPerCourse: BigDecimal(precision=12, scale=2)
- numberOfCourses: Integer, @Min(1)
- scholarshipAmount: BigDecimal(precision=12, scale=2), default 0
- createdAt: Instant
- user: @ManyToOne(fetch=LAZY)

### RULES
- All monetary amounts are BigDecimal with precision=12, scale=2. NEVER double or float.
- Every user-owned entity has @ManyToOne(fetch=LAZY) to User — non-nullable.
- Generate the three enum files as separate classes in com.fms.model.

Then generate four Spring Data JPA repositories in com.fms.repository:

### UserRepository
- Optional<User> findByEmail(String email)
- boolean existsByEmail(String email)

### IncomeRepository
- List<Income> findByUser(User user)
- List<Income> findByUserOrderByDateDesc(User user)
- List<Income> findByUserAndDateBetween(User user, LocalDate from, LocalDate to)

### ExpenseRepository
- List<Expense> findByUser(User user)
- List<Expense> findByUserOrderByDateDesc(User user)
- List<Expense> findByUserAndDateBetween(User user, LocalDate from, LocalDate to)

### TuitionPlanRepository
- List<TuitionPlan> findByUserOrderByCreatedAtDesc(User user)

Return types must match exactly. No extra methods.
```
