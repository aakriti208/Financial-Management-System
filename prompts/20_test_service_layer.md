# Prompt 20 — Service Layer Tests (Deep Coverage)
**Phase:** Testing

---

## Context
The initial test prompt (09) covered the basic happy path. Now writing deeper service-layer tests covering edge cases, boundary conditions, and algorithm correctness — particularly for DashboardService, ExpensePredictionService, and TuitionService.

---

## Prompt

```
Generate comprehensive JUnit 5 + Mockito unit tests for the FMS service layer.
Focus on edge cases and algorithm correctness.
All tests use @ExtendWith(MockitoExtension.class). Mock repositories, never hit a real DB.

---

### DashboardServiceImplTest (extend existing tests)

shouldReturnZeroTotals_whenUserHasNoData
  - Mock repositories return empty lists
  - Assert totalIncome=0, totalExpenses=0, netBalance=0
  - Assert recentIncome and recentExpenses are empty lists (NOT null)
  - Assert monthlyData has exactly 6 entries

shouldCalculateNetBalanceCorrectly_withMixedData
  - Income: [1000.00, 500.00, 250.75] -> totalIncome = 1750.75
  - Expenses: [300.00, 150.25] -> totalExpenses = 450.25
  - netBalance must equal 1300.50 exactly (BigDecimal comparison with compareTo)

shouldCapRecentItemsAtFive_whenMoreThanFiveExist
  - Mock findByUserOrderByDateDesc returning 8 income records
  - Assert recentIncome.size() == 5

shouldReturnSixMonthlyEntries_always
  - Even with no data, monthlyData.size() must == 6

shouldFormatMonthLabelCorrectly
  - Assert month labels match 3-letter English abbreviations (Jan, Feb, Mar...)

---

### ExpensePredictionServiceImplTest

shouldReturnEmptyList_whenUserHasNoExpenses
  - No expenses in DB -> return empty list (not null, not exception)

shouldCalculateMovingAverageCorrectly_forSingleCategory
  - 3 months of "Food" expenses: 100, 150, 200
  - Expected prediction = (100+150+200)/3 = 150.00
  - Assert result[0].amount.compareTo(new BigDecimal("150.00")) == 0

shouldHandleCategory_appearsInOnly1Month
  - "Entertainment" only in one month: $80
  - distinctMonths = 1, prediction = 80.00 / 1 = 80.00

shouldPredictMostFrequentExpenseType
  - Category "Housing" has 2x FIXED, 1x VARIABLE
  - Assert predicted expenseType == FIXED

shouldPredictMostFrequentNecessity
  - Category "Entertainment" has 3x DISCRETIONARY, 1x ESSENTIAL
  - Assert predicted necessity == DISCRETIONARY

shouldSortResultsByPredictedAmountDescending
  - Housing=$800 avg, Food=$200 avg, Transport=$100 avg
  - Assert result[0].category == "Housing"
  - Assert result[2].category == "Transport"

shouldExcludeCurrentMonthFromCalculation
  - Add expense in current month + 3 months of history
  - Assert current month is NOT included in the average

---

### TuitionServiceImplTest

shouldReturnAffordable_whenSavingsCoverTuition
  - totalIncome=$5000, totalExpenses=$2000 -> savings=$3000
  - netTuition=$2500
  - Assert affordable=true, monthsNeeded=0

shouldReturnMonthsNeeded_whenSavingsInsufficient
  - savings=$500, netTuition=$2000, monthlySurplus=$300
  - gap = 1500, monthsNeeded = ceil(1500/300) = 5
  - Assert affordable=false, monthsNeeded=5

shouldReturnNegativeOne_whenSurplusIsZeroOrNegative
  - Monthly surplus <= 0
  - Assert affordable=false, monthsNeeded=-1

shouldDeductScholarshipFromGrossTuition
  - tuitionPerCourse=1000, courses=3, scholarship=1500
  - grossTuition=3000, netTuition=1500
  - Assert result.netTuition.compareTo(new BigDecimal("1500.00")) == 0

shouldFloorNetTuitionAtZero_whenScholarshipExceedsGross
  - grossTuition=1000, scholarship=2000
  - netTuition must be 0.00 (NOT negative)

---

### AuthServiceImplTest (extend existing)

shouldHashPasswordWithBCrypt_onRegister
  - Capture saved User argument with ArgumentCaptor
  - Assert saved.getPasswordHash() != plainTextPassword
  - Assert passwordEncoder.matches(plainText, saved.getPasswordHash()) == true

shouldThrowException_whenLoginWithCorrectEmailWrongPassword
  - Mock passwordEncoder.matches returning false
  - Assert RuntimeException is thrown with message "Invalid email or password"

### Conventions:
- All money assertions use BigDecimal.compareTo(expected) == 0 (never assertEquals with BigDecimal)
- Test method names follow: shouldExpectedBehavior_whenCondition
- Use @BeforeEach to set up a shared test User object
```
