# Prompt 17 — State Diagram: Expense & Income Management
**Phase:** Documentation / Diagrams

---

## Context
State diagram covering the full lifecycle of an expense or income record — from the user opening the page, to creating, editing, and deleting entries. The diagram should reflect both frontend state (form modes) and backend state (persistence).

---

## Prompt

```
Generate a UML state diagram in PlantUML syntax for the Expense/Income Management flow.
The diagram applies equally to both Income and Expense pages (symmetric behavior).

### States:

Page Loading
  - Entry: call getAllExpenses() / getAllIncome()
  - Transitions:
      Page Loading -> List View: "Data fetch succeeds (200 OK)"
      Page Loading -> Error State: "Network error or 401/500 response"

Error State
  - Shows error banner with Retry button
  - Transition: Error State -> Page Loading: "User clicks Retry"

List View (main state)
  - Shows table of all records + blank Add form at top
  - Internal transitions:
      "User fills form" -> Form: Add Mode (sub-state)
      "User clicks Edit on a row" -> Form: Edit Mode (sub-state)
      "User clicks Delete on a row" -> Confirm Delete

Form: Add Mode
  - Sub-states: Idle, Submitting, Success, Error
  - Transitions:
      Idle -> Submitting: "User clicks Save (client validation passes)"
      Idle -> Idle: "Client validation fails — show inline error"
      Submitting -> Success: "201 Created"
      Submitting -> Error: "400 / 500 response"
      Success -> List View: "Re-fetch list, clear form"
      Error -> Idle: "Show error banner, allow retry"

Form: Edit Mode
  - Entry action: pre-fill form fields with selected record's data
  - Sub-states: Idle, Submitting, Success, Error (same as Add Mode)
  - Transitions:
      Idle -> Submitting: "User clicks Update"
      Submitting -> Success: "200 OK"
      Submitting -> Error: "400 / 403 / 500"
      Success -> List View: "Re-fetch list, exit edit mode"
      Idle -> List View: "User clicks Cancel"

Confirm Delete
  - Entry action: show browser confirm() dialog
  - Transitions:
      Confirm Delete -> Deleting: "User confirms"
      Confirm Delete -> List View: "User cancels"

Deleting
  - Transitions:
      Deleting -> List View: "204 No Content — re-fetch list"
      Deleting -> List View (with error banner): "403 Forbidden or 500"

### Record Lifecycle (backend perspective — add as a note):
CREATED (POST /api/expenses) -> STORED (in PostgreSQL)
STORED -> UPDATED (PUT /api/expenses/{id}) [owner only]
STORED -> DELETED (DELETE /api/expenses/{id}) [owner only]
Any access by non-owner -> 403 FORBIDDEN

### Diagram style:
- Use composite states for Form sub-states
- Add entry actions where relevant
- Keep guard conditions in square brackets [e.g. client validation passes]
```
