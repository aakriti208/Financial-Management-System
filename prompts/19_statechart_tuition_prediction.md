# Prompt 19 — State Diagrams: Tuition Planner & Expense Prediction
**Phase:** Documentation / Diagrams

---

## Context
State diagrams for the two analytical features — the tuition affordability planner and the expense prediction page. Both are mostly stateless computations triggered by user input, but the affordability result has meaningful branching states worth diagramming.

---

## Prompt

```
Generate two UML state diagrams in PlantUML syntax.

---

## DIAGRAM 1 — Tuition Planner

States:

Input Form
  - Initial state
  - Fields: tuition per course, number of courses, scholarship amount
  - Transition: Input Form -> Calculating: "User submits form [all fields valid]"
  - Transition: Input Form -> Input Form: "Validation fails [e.g. courses < 1]" (self-loop with guard)

Calculating
  - Entry action: call POST /api/tuition/calculate
  - Shows loading spinner on button
  - Transitions:
      Calculating -> Result: Affordable: "Response: affordable = true"
      Calculating -> Result: Save First: "Response: affordable = false, monthsNeeded > 0"
      Calculating -> Result: Deficit: "Response: affordable = false, monthsNeeded = -1 (surplus <= 0)"
      Calculating -> Error: "Network or server error"

Result: Affordable
  - Shows green card: "You can afford this now"
  - Displays gross tuition, net tuition, current savings
  - Transition: Result: Affordable -> Input Form: "User clicks Recalculate"

Result: Save First
  - Shows amber card: "You'll be ready in N months"
  - Displays monthly surplus and estimated timeline
  - Transition: Result: Save First -> Input Form: "User clicks Recalculate"

Result: Deficit
  - Shows red card: "Reduce your monthly expenses first"
  - Displays current savings shortfall
  - Transition: Result: Deficit -> Input Form: "User clicks Recalculate"

Error
  - Shows error banner
  - Transition: Error -> Input Form: "User clicks Retry"

---

## DIAGRAM 2 — Expense Prediction

States:

Page Loading
  - Entry action: call GET /api/prediction/expenses
  - Transitions:
      Page Loading -> Displaying Predictions: "200 OK — list returned"
      Page Loading -> Empty State: "200 OK — empty list (no history)"
      Page Loading -> Error: "Network or server error"

Displaying Predictions
  - Shows table: category | predicted amount | type | necessity
  - Each row is a forecasted category for next month
  - No user interaction — read-only view
  - Note: predictions calculated from moving average of last 6 months

Empty State
  - Shows message: "Not enough expense history to generate a prediction"
  - Guidance: "Add at least a few months of expense data to see predictions"

Error
  - Shows error banner with retry
  - Transition: Error -> Page Loading: "User clicks Retry"

### Backend note (annotate on the Page Loading state):
Algorithm:
  1. Load all expenses for user
  2. Group by category
  3. For each category:
     - predictedAmount = total / distinctMonths (moving average, HALF_UP)
     - predictedType = most frequent ExpenseType
     - predictedNecessity = most frequent Necessity
  4. Sort by predicted amount descending
  5. Return as List<ExpenseDTO>

### Diagram style:
- Two separate diagrams, clearly titled
- Use [*] for initial state
- Add backend algorithm as a note block
- Keep guards in square brackets
```
