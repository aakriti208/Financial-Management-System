# Prompt 06 — Expense Prediction & What-If Simulation
**Phase:** Prediction & Simulation

---

## Context
Dashboard is live. Now adding the two forward-looking features: expense prediction (statistical moving average over historical data) and a what-if simulation that lets users model hypothetical monthly scenarios. Neither feature should touch or mutate stored records.

---

## Prompt

```
Generate two backend features: Expense Prediction and What-If Simulation.
Package: com.fms. These are read-only — neither feature persists data.

---

## PART A — Expense Prediction

### Algorithm (moving average by category)
1. Load all expenses for the current user
2. Filter to the last 6 months (exclude the current in-progress month)
3. Group expenses by category
4. For each category:
   a. distinctMonths = number of distinct YearMonth values the category appeared in
   b. predictedAmount = totalAmountForCategory / distinctMonths  (BigDecimal, HALF_UP, scale 2)
   c. predictedExpenseType = most frequent ExpenseType across the category's records
   d. predictedNecessity = most frequent Necessity across the category's records
5. Sort results by predictedAmount descending

### ExpenseDTO reuse
Return List<ExpenseDTO> where each DTO represents a predicted category entry.
Populate: category, amount (predicted), expenseType, necessity. Set date = first day of next month.

### ExpensePredictionService (interface + impl)
List<ExpenseDTO> predictNextMonthExpenses(String userEmail)

### PredictionController
GET /api/prediction/expenses -> List<ExpenseDTO> (200)
Resolve email from @AuthenticationPrincipal String email

---

## PART B — What-If Simulation

### SimulationRequestDTO
BigDecimal hypotheticalMonthlyIncome    @NotNull @DecimalMin("0.00")
BigDecimal hypotheticalMonthlyExpenses  @NotNull @DecimalMin("0.00")
Integer projectionMonths                @NotNull @Min(1) @Max(60)

### SimulationResultDTO
BigDecimal currentBalance        // totalIncome - totalExpenses today
BigDecimal monthlySurplus        // hypothetical income - hypothetical expenses
BigDecimal projectedEndBalance   // currentBalance + surplus * months
String verdict                   // "Surplus", "Break-even", or "Deficit"
List<MonthlyDataDTO> timeline    // month 1..N with running balance

### WhatIfSimulationServiceImpl
currentBalance = sum(income) - sum(expenses) for user
surplus = req.hypotheticalMonthlyIncome.subtract(req.hypotheticalMonthlyExpenses)
for m in 1..projectionMonths:
    runningBalance = currentBalance.add(surplus.multiply(BigDecimal.valueOf(m)))
    timeline.add(MonthlyDataDTO with label="Month " + m, income=req.income, expenses=req.expenses)
verdict = surplus > 0 ? "Surplus" : surplus == 0 ? "Break-even" : "Deficit"

### SimulationController
POST /api/simulation/run -> SimulationResultDTO (200)

### CRITICAL
DO NOT persist anything. DO NOT modify stored income or expense records.
Both features are purely computational — read-only access to existing data.
```
