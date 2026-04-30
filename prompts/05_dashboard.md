# Prompt 05 — Dashboard & Tuition Planner
**Phase:** Analytics Features

---

## Context
CRUD is done and tested. Now building the dashboard summary view and the tuition affordability planner. The dashboard needs totals + a 6-month monthly breakdown for the chart. The tuition planner uses current savings and monthly surplus to estimate affordability.

---

## Prompt

```
Generate the Dashboard and Tuition Planner features for the FMS Spring Boot backend.

---

## PART A — Dashboard

### DashboardSummaryDTO
BigDecimal totalIncome
BigDecimal totalExpenses
BigDecimal netBalance          // totalIncome - totalExpenses
List<IncomeDTO> recentIncome   // 5 most recent
List<ExpenseDTO> recentExpenses // 5 most recent
List<MonthlyDataDTO> monthlyData  // last 6 months

### MonthlyDataDTO
String month       // 3-letter abbreviation e.g. "Jan"
BigDecimal income
BigDecimal expenses

### DashboardServiceImpl
- totalIncome  = sum of all Income.amount for user
- totalExpenses = sum of all Expense.amount for user
- netBalance = totalIncome.subtract(totalExpenses)
- recentIncome: findByUserOrderByDateDesc, take first 5
- recentExpenses: findByUserOrderByDateDesc, take first 5
- monthlyData: loop current month back 5 months (6 total):
    for each month: findByUserAndDateBetween -> sum amounts -> MonthlyDataDTO
    label = month.getMonth().getDisplayName(SHORT, Locale.ENGLISH)
- Use BigDecimal.ZERO as starting accumulator. NEVER return null lists.

### DashboardController
GET /api/dashboard/summary -> DashboardSummaryDTO (200)
User-scoped via SecurityContext.

---

## PART B — Tuition Planner

### TuitionRequestDTO
BigDecimal tuitionPerCourse    @NotNull @DecimalMin("0.00")
Integer numberOfCourses        @NotNull @Min(1)
BigDecimal scholarshipAmount   @NotNull (default 0)

### TuitionResultDTO
BigDecimal grossTuition
BigDecimal netTuition          // after scholarship, minimum 0
BigDecimal currentSavings
BigDecimal monthlySurplus      // average net over last 6 months
boolean affordable
int monthsNeeded               // 0 if already affordable, -1 if surplus <= 0
String advice                  // plain-English message

### TuitionServiceImpl algorithm (MANDATORY)
grossTuition = tuitionPerCourse * numberOfCourses
netTuition = max(grossTuition - scholarshipAmount, 0)
currentSavings = max(totalIncome - totalExpenses, 0)
monthlySurplus = average of (income - expenses) for each of last 6 months

if currentSavings >= netTuition:
    affordable=true, monthsNeeded=0, advice="You can afford this now."
elif monthlySurplus <= 0:
    affordable=false, monthsNeeded=-1, advice="Reduce monthly expenses first."
else:
    gap = netTuition - currentSavings
    monthsNeeded = ceil(gap / monthlySurplus)
    affordable=false, advice="You'll be ready in N months."

Persist TuitionPlan entity on every POST.

### TuitionController
POST /api/tuition/calculate -> TuitionResultDTO (200)
```
