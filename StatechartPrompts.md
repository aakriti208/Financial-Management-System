# Statechart Prompts — Financial Management System

**CS 5394 Software Engineering · Group 2**
Aakriti Dhakal · Agnes Jesionowska · Manoj Khanal

This document contains the five prompts used to generate the five UML statechart diagrams for our Financial Management System (FMS) submission (SRS §submission item #4). Each prompt targets one state-heavy workflow from the SRS functional requirements.

1. **S1 — Authentication** (`Statechart_Authentication.png` / `.svg`) — covers SRS §3.1.1 Create Account + §3.1.2 Login + session lifecycle.
2. **S2 — Income / Expense Record Lifecycle** (`Statechart_ExpenseIncomeLifecycle.png` / `.svg`) — covers SRS §3.1.3 Record Income + §3.1.4 Record Expense (CRUD).
3. **S3 — Tuition Planning** (`Statechart_TuitionPlanning.png` / `.svg`) — covers SRS §3.1.5 Tuition Planning.
4. **S4 — What-If Simulation** (`Statechart_WhatIfSimulation.png` / `.svg`) — covers SRS §3.1.8 What-If Simulation.
5. **S5 — AI Advisor Session** (`Statechart_AIAdvisorSession.png` / `.svg`) — covers SRS §3.1.7 AI Financial Advisor.

All five prompts follow the prompt-engineering principles defined in `promptGuidelines.docx`:

- **Sandwich Method** — the most important instructions appear at the top and are repeated at the bottom so they are not lost mid-context.
- **Attention Anchoring** — `MANDATORY`, `CRITICAL`, `MUST`, `DO NOT` in capitals to focus on non-negotiable constraints.
- **Visual Emphasis** — bold text, ALL CAPS, and ✓/✗ markers for positive/negative examples.
- **Clear Delimiters** — `###` headings and triple-backtick code fences to separate sections.
- **Selective Context** — only the SRS subsection + the source classes relevant to a given workflow.

All five diagrams are produced by one Python + Graphviz script, `docs/render_statecharts.py`. Re-render with:

```bash
python3 docs/render_statecharts.py
```

---

## Shared UML Statechart Conventions (apply to ALL five prompts)

Every prompt in this file assumes and enforces the same notation:

| Element | Notation | Graphviz rendering |
|---|---|---|
| **Initial state** | ● (filled black circle) | `shape=circle, style=filled, fillcolor=black, width=0.28` |
| **Final state** | ◉ (double circle, inner filled) | `shape=doublecircle, style=filled, fillcolor=black` |
| **Named state** | Rounded rectangle with **state name** (bold) and optional `entry / …`, `do / …`, `exit / …` actions | `shape=rectangle, style=rounded,filled` |
| **Transition** | Arrow labelled `trigger [guard] / action` | `arrowhead=vee` |
| **Error transition** | Same, dashed, red | `color=#C62828, style=dashed` |
| **Success transition** | Same, solid, green | `color=#2E7D32` |
| **Neutral transition** | Same, solid, dark grey | `color=#37474F` |

State colour palette (one colour per UX "phase" of a workflow):

- Grey `#ECEFF1` — Idle / entry states
- Orange `#FFF3E0` — User-input states
- Yellow `#FFFDE7` — Validation states
- Blue `#E3F2FD` — Calculation / computation states
- Green `#E8F5E9` — Success / persisted states
- Purple `#F3E5F5` — External-service states (e.g., OpenAI)
- Red `#FFEBEE` — Error / rollback states

---
---

## S1 — Authentication Statechart Prompt

### CRITICAL — READ FIRST

**MANDATORY:** Produce ONE UML statechart that shows the full authentication lifecycle of the Financial Management System: landing page → register OR login → active session → token expiry OR logout. The statechart MUST use **standard UML notation** (initial solid circle, final double circle, rounded-rectangle states, labelled transitions). The statechart MUST reflect the SRS non-functional requirements (HTTPS-only, 15-minute idle timeout, JWT-based stateless sessions).

**DO NOT** conflate register and login into one state — they are separate flows that both converge on `Session Active`. DO NOT draw Spring/React classes; this is a **state** diagram, not a class diagram.

---

### Context

```
Project:    Financial Management System (FMS)
Reference:  SRS_Draft.pdf v1.0 §3.1.1 Create Account, §3.1.2 Login,
            §4 Non-Functional: 15-min session timeout, HTTPS,
            JWT stateless auth
Source:     backend/com/fms/controller/AuthController.java
            backend/com/fms/service/AuthServiceImpl.java (TODO stub)
            backend/com/fms/config/{SecurityConfig,JwtUtil}.java
            frontend/src/context/AuthContext.jsx
            frontend/src/api/axiosInstance.js  (401 → logout interceptor)
```

---

### MANDATORY states (seven total, plus start + end)

1. **Unauthenticated** (initial target) — `entry / render Login page`, `do / wait for user action`.
2. **Registering** — `entry / render RegisterPage`, `do / collect firstName, lastName, email, password`.
3. **Validating Registration** — `do / POST /api/auth/register`, `@Valid RegisterRequest`, `BCrypt-hash password`, `check email uniqueness`.
4. **Entering Credentials** — `entry / render LoginPage`, `do / collect email + password`.
5. **Validating Credentials** — `do / POST /api/auth/login`, `lookup user by email`, `BCrypt.matches(password, hash)`, `generate JWT (HS256)`.
6. **Session Active** — `entry / store JWT + user in AuthContext`, `do / every request attaches Bearer <token>`, `JwtAuthFilter validates on each call`.
7. **Token Expired** — `entry / axios 401 interceptor fires`, `do / clear AuthContext, redirect to /login`.

---

### MANDATORY transitions

| From | To | Trigger | Guard / Action |
|---|---|---|---|
| ● | Unauthenticated | — | — |
| Unauthenticated | Registering | click Register | — |
| Unauthenticated | Entering Credentials | click Login | — |
| Registering | Validating Registration | submit form | `/ POST /api/auth/register` |
| Validating Registration | Registering | 400 Bad Request | `[email taken or validation fail] / show error` (dashed red) |
| Validating Registration | Session Active | 201 Created | `/ save JWT + user` (green) |
| Entering Credentials | Validating Credentials | submit form | `/ POST /api/auth/login` |
| Validating Credentials | Entering Credentials | 401 Unauthorized | `[wrong password] / show error` (dashed red) |
| Validating Credentials | Session Active | 200 OK | `/ save JWT + user` (green) |
| Session Active | Session Active | authenticated request | (self-loop) |
| Session Active | Token Expired | JWT expired | `[> 24h OR 15-min idle timeout]` (dashed red) |
| Token Expired | Entering Credentials | auto-redirect | — |
| Session Active | ◉ | click Logout | `/ clear AuthContext` |

---

### Positive / negative examples

**✓ DO:**
- Label the self-loop on `Session Active` as `authenticated request` so the reviewer sees the steady state.
- Use a dashed red arrow for the `JWT expired` transition — this is an error-path, not a happy-path.

**✗ DO NOT:**
- Draw a single "Authenticating" state that covers both register and login — they are separate with different validations.
- Use plain edges without `trigger [guard] / action` labels; every transition must carry a label.

---

### CRITICAL — REPEATED (sandwich closer)

**MANDATORY:** Seven named states, one initial state, one final state. Register and Login are separate flows converging on `Session Active`. Token expiry is a dashed red transition. Use `trigger [guard] / action` on every edge. Render landscape/portrait PNG + SVG.

---
---

## S2 — Income / Expense Record Lifecycle Prompt

### CRITICAL — READ FIRST

**MANDATORY:** Produce ONE UML statechart that shows the CRUD lifecycle for a single Income OR Expense record (both follow the identical flow in this system). States MUST cover: No Record → Draft → Validating → Persisted → Editing → Updating → Confirm Delete → final. The diagram MUST show Bean Validation failures as dashed red loopbacks.

**DO NOT** mix in UI routing, the global navigation state, or anything outside a single record's lifecycle. This is **record-level** state, not page-level state.

---

### Context

```
Project:    Financial Management System (FMS)
Reference:  SRS_Draft.pdf §3.1.3 Record Income, §3.1.4 Record Expense
Endpoints:  GET/POST/PUT/DELETE /api/income | /api/expense
Source:     backend/com/fms/dto/IncomeDTO.java (and ExpenseDTO)
            backend/com/fms/service/IncomeService.java (and ExpenseService)
            backend/com/fms/controller/IncomeController.java
            frontend/src/pages/IncomePage.jsx
            frontend/src/components/IncomeForm.jsx
```

---

### MANDATORY states (seven total, plus start + end)

1. **No Record** (initial target) — `entry / render IncomePage | ExpensePage`.
2. **Draft** — `entry / render IncomeForm | ExpenseForm`, `do / user fills amount, source/category, date, description`.
3. **Validating** — `do / Bean Validation`, `@DecimalMin("0.01") amount`, `@NotBlank source | category`, `@NotNull date`, `persist User reference`.
4. **Persisted** — `entry / INSERT into income | expenses`, `do / display row in list, update DashboardSummaryDTO totals`.
5. **Editing** — `entry / populate form with row data`, `do / allow field edits`.
6. **Updating** — `do / PUT /api/income/{id} | /api/expense/{id}`, `@Valid dto`, `UPDATE row`.
7. **Confirm Delete** — `do / show confirmation dialog`.

---

### MANDATORY transitions

| From | To | Trigger | Guard / Action |
|---|---|---|---|
| ● | No Record | — | — |
| No Record | Draft | click Add | — |
| Draft | Validating | submit | — |
| Validating | Draft | 400 Bad Request | `[constraint violation] / show field errors` (dashed red) |
| Validating | Persisted | 201 Created | `/ append to list` (green) |
| Persisted | Editing | click Edit | — |
| Editing | Updating | submit | — |
| Updating | Editing | 400 Bad Request | (dashed red) |
| Updating | Persisted | 200 OK | `/ refresh row` (green) |
| Persisted | Confirm Delete | click Delete | — |
| Confirm Delete | Persisted | cancel | (dashed grey) |
| Confirm Delete | ◉ | confirm | `/ DELETE /api/income/{id} → 204 No Content` (red) |
| Persisted | Draft | click Add another | — |

---

### Positive / negative examples

**✓ DO:**
- Show `Validating → Draft` as dashed red with the constraint annotation list (`@DecimalMin`, `@NotBlank`, `@NotNull`) inside the state so the reviewer can see which validators fire.
- Use a `Confirm Delete → Persisted` dashed grey loopback for cancel.

**✗ DO NOT:**
- Show both Income and Expense as separate statecharts — they share the same lifecycle; one diagram with `Income | Expense` in the titles / labels is enough.
- Draw the `DELETE` transition as dashed — delete is a deliberate user action, show it as a solid red success.

---

### CRITICAL — REPEATED (sandwich closer)

**MANDATORY:** CRUD lifecycle for one Income or Expense row. Seven named states. Validation failures are dashed red loopbacks. The `confirm` delete transition is solid red to the final state. Render at 200 DPI.

---
---

## S3 — Tuition Planning Statechart Prompt

### CRITICAL — READ FIRST

**MANDATORY:** Produce ONE UML statechart covering the tuition calculation workflow from SRS §3.1.5. The chart MUST show the calculation formula inside the `Calculating` state (`grossTuition = tuitionPerCourse × numberOfCourses`, `netTuition = grossTuition − scholarshipAmount`). The result state MUST reflect the ACTUAL `TuitionResultDTO` fields (`tuitionPerCourse`, `numberOfCourses`, `scholarshipAmount`, `grossTuition`, `netTuition`) — NOT any hypothetical fields.

**DO NOT** invent result fields like "monthlyPayment" or "affordable" — those are not in the source. Refer to `backend/com/fms/dto/TuitionResultDTO.java` for the exact field list.

---

### Context

```
Project:    Financial Management System (FMS)
Reference:  SRS_Draft.pdf §3.1.5 Tuition Planning
Endpoint:   POST /api/tuition/calculate
DTOs:       TuitionRequestDTO  { tuitionPerCourse, numberOfCourses,
                                 scholarshipAmount }
            TuitionResultDTO   { tuitionPerCourse, numberOfCourses,
                                 scholarshipAmount, grossTuition,
                                 netTuition }
Source:     backend/com/fms/service/TuitionService.java
            frontend/src/pages/TuitionPlannerPage.jsx
            frontend/src/components/TuitionForm.jsx
```

---

### MANDATORY states (six total, plus start + end)

1. **Idle** (initial target) — `entry / navigate to TuitionPlannerPage`.
2. **Entering Inputs** — `entry / render TuitionForm`, `do / collect tuitionPerCourse, numberOfCourses, scholarshipAmount`.
3. **Validating** — `do / Bean Validation`, `@DecimalMin("0.01") tuitionPerCourse`, `@Min(1) numberOfCourses`.
4. **Calculating** — `do / POST /api/tuition/calculate`, `grossTuition = per × number`, `netTuition = gross − scholarship`, `persist TuitionPlan`.
5. **Displaying Result** — `entry / render TuitionResultDTO`, show `grossTuition` and `netTuition`, `do / wait for user review`.
6. **Adjusting Inputs** — `do / modify numberOfCourses / scholarshipAmount`.

---

### MANDATORY transitions

| From | To | Trigger | Guard / Action |
|---|---|---|---|
| ● | Idle | — | — |
| Idle | Entering Inputs | visit page | — |
| Entering Inputs | Validating | click Calculate | — |
| Validating | Entering Inputs | 400 Bad Request | `[invalid numbers]` (dashed red) |
| Validating | Calculating | pass | `/ TuitionService.calculate(email, req)` (green) |
| Calculating | Displaying Result | 200 OK | (green) |
| Calculating | Entering Inputs | 500 Error | (dashed red) |
| Displaying Result | Adjusting Inputs | click Recalculate | — |
| Adjusting Inputs | Validating | click Calculate | — |
| Displaying Result | ◉ | leave page | — |

---

### Positive / negative examples

**✓ DO:**
- Embed the arithmetic `grossTuition = per × number` and `netTuition = gross − scholarship` as `do /` actions inside the `Calculating` state.
- Connect `Adjusting Inputs → Validating` so that recalculation re-validates the new numbers.

**✗ DO NOT:**
- Skip the `Validating` state and go directly from `Entering Inputs → Calculating` — validation is a distinct step.
- Reference `TuitionRequestDTO.monthsUntilDue` (it does not exist in the current source).

---

### CRITICAL — REPEATED (sandwich closer)

**MANDATORY:** Six named states plus start + end. Calculation formula shown inside `Calculating` state. Result fields match `TuitionResultDTO` exactly: `grossTuition`, `netTuition` (no extras). Validation and recalculation are a distinct sub-loop. Render PNG + SVG at 200 DPI.

---
---

## S4 — What-If Simulation Statechart Prompt

### CRITICAL — READ FIRST

**MANDATORY:** Produce ONE UML statechart covering the what-if simulation workflow from SRS §3.1.8. The chart MUST show the simulation loop body (`for m = 1..months: balance += income − expenses; monthlyBalances[m] = balance`) inside the `Simulating` state. The chart MUST include a `Comparing Scenarios` state so the reviewer sees the system supports running multiple scenarios side-by-side.

**DO NOT** invent fields like `hypoSurplus` or `verdict` — the actual `SimulationResultDTO` contains `projectedFinalBalance`, `projectedTotalSavings`, and `monthlyBalances : List<BigDecimal>` only.

---

### Context

```
Project:    Financial Management System (FMS)
Reference:  SRS_Draft.pdf §3.1.8 What-If Simulation
Endpoints:  POST /api/simulation/run
            GET /api/dashboard/summary  (for baseline)
DTOs:       SimulationRequestDTO { hypotheticalMonthlyIncome,
                                   hypotheticalMonthlyExpenses, months }
            SimulationResultDTO  { projectedFinalBalance,
                                   projectedTotalSavings,
                                   monthlyBalances : List<BigDecimal> }
Source:     backend/com/fms/service/WhatIfSimulationService.java
            frontend/src/pages/SimulationPage.jsx
            frontend/src/components/SimulationForm.jsx
```

---

### MANDATORY states (seven total, plus start + end)

1. **Idle** (initial target) — `entry / navigate to SimulationPage`.
2. **Loading Baseline** — `entry / GET /api/dashboard/summary`, `do / fetch user's actual income + expense history`, `populate current trajectory`.
3. **Configuring Scenario** — `entry / render SimulationForm`, `do / collect hypotheticalMonthlyIncome, hypotheticalMonthlyExpenses, months`.
4. **Validating** — `do / Bean Validation`, `@DecimalMin income, expenses`, `@Min(1) @Max(60) months`.
5. **Simulating** — `do / POST /api/simulation/run`, `for m = 1..months: balance += income − expenses; monthlyBalances[m] = balance`, `projectedFinalBalance`, `projectedTotalSavings`.
6. **Displaying Projection** — `entry / render SimulationResultDTO`, `monthlyBalances chart`, `final + total savings`.
7. **Comparing Scenarios** — `do / add another scenario to chart, label each run`.

---

### MANDATORY transitions

| From | To | Trigger | Guard / Action |
|---|---|---|---|
| ● | Idle | — | — |
| Idle | Loading Baseline | visit page | — |
| Loading Baseline | Configuring Scenario | history loaded | (green) |
| Loading Baseline | Idle | fetch error | (dashed red) |
| Configuring Scenario | Validating | click Run | — |
| Validating | Configuring Scenario | 400 Bad Request | (dashed red) |
| Validating | Simulating | pass | `/ WhatIfSimulationService.runSimulation()` (green) |
| Simulating | Displaying Projection | 200 OK | (green) |
| Simulating | Configuring Scenario | 500 Error | (dashed red) |
| Displaying Projection | Configuring Scenario | new scenario | — |
| Displaying Projection | Comparing Scenarios | add scenario | — |
| Comparing Scenarios | Configuring Scenario | new scenario | — |
| Displaying Projection | ◉ | leave page | — |

---

### Positive / negative examples

**✓ DO:**
- Embed the full per-month loop `for m = 1..months: balance += income − expenses` as `do /` inside the `Simulating` state.
- Enforce `@Min(1) @Max(60) months` in the `Validating` state to match the SRS NFR (up to 5-year horizon).

**✗ DO NOT:**
- Use a `PredictionResultDTO` here — that belongs to §3.1.6 Expense Prediction, not §3.1.8 Simulation.
- Skip `Loading Baseline` — the baseline fetch is part of the workflow per the SRS "Inputs" section.

---

### CRITICAL — REPEATED (sandwich closer)

**MANDATORY:** Seven named states covering baseline load, scenario config, validation, simulation loop, projection display, and scenario comparison. Simulation loop body shown inside `Simulating`. Result fields match `SimulationResultDTO` exactly. Render PNG + SVG.

---
---

## S5 — AI Advisor Session Statechart Prompt

### CRITICAL — READ FIRST

**MANDATORY:** Produce ONE UML statechart covering an AI Financial Advisor chat session from SRS §3.1.7. The chart MUST distinguish between the **internal backend pipeline** (loading user context, building the prompt) and the **external OpenAI call** (Awaiting OpenAI state). The chart MUST enforce the SRS NFR of `≤ 5 s` response SLA as a guard on the timeout transition to the Error state.

**DO NOT** hide the OpenAI step behind a single `Processing` state — the fact that we call an external service is important architectural information. Use a distinct state colour (purple) for external-service states.

---

### Context

```
Project:    Financial Management System (FMS)
Reference:  SRS_Draft.pdf §3.1.7 AI Financial Advisor
            Non-Functional: ≤ 5 s AI response time
Endpoints:  POST /api/ai/ask
            External: POST https://api.openai.com/v1/chat/completions
DTOs:       AIQueryDTO    { question : String @NotBlank }
            AIResponseDTO { answer : String, model : String,
                            generatedAt : Instant }
Source:     backend/com/fms/service/AIAdvisorServiceImpl.java
             - @Value("${openai.api.key}") openAiApiKey
             - fetch DashboardSummaryDTO for context
             - build system prompt, POST to OpenAI
            frontend/src/pages/AIAdvisorPage.jsx
            frontend/src/components/AIChat.jsx
```

---

### MANDATORY states (nine total, plus start + end)

1. **Idle** (initial target) — `entry / navigate to AIAdvisorPage`.
2. **Composing Question** — `entry / focus AIChat textarea`, `do / user types question`.
3. **Sending Request** — `do / POST /api/ai/ask`, `@Valid AIQueryDTO { question }`.
4. **Loading Context** (internal backend) — `do / AIAdvisorService.ask(email, query)`, `fetch DashboardSummaryDTO`, `fetch recent expenses + income`.
5. **Building Prompt** (internal backend) — `do / assemble system prompt { totals, recent items, user question }`.
6. **Awaiting OpenAI** (external, purple) — `do / POST api.openai.com/v1/chat/completions`, `Authorization: Bearer ${openai.api.key}`, `model: gpt-4o-mini`, `(≤ 5 s SLA per NFR)`.
7. **Streaming Response** (external, purple) — `do / read completion chunks, append to AIChat message`.
8. **Response Displayed** — `entry / render AIResponseDTO`, `answer, model, generatedAt`.
9. **Error** — `entry / show error banner`, `do / log + offer retry`.

---

### MANDATORY transitions

| From | To | Trigger | Guard / Action |
|---|---|---|---|
| ● | Idle | — | — |
| Idle | Composing Question | open chat | — |
| Composing Question | Sending Request | click Send | — |
| Sending Request | Loading Context | 201 Accepted | (green) |
| Sending Request | Error | 400 Bad Request | `[empty question]` (dashed red) |
| Loading Context | Building Prompt | context loaded | — |
| Building Prompt | Awaiting OpenAI | HTTP call dispatched | — |
| Awaiting OpenAI | Streaming Response | 200 OK | (green) |
| Awaiting OpenAI | Error | timeout / 5xx | `[elapsed > 5 s]` (dashed red) |
| Streaming Response | Response Displayed | stream complete | (green) |
| Response Displayed | Composing Question | follow-up question | — |
| Error | Composing Question | click Retry | — |
| Response Displayed | ◉ | close chat | — |

---

### Positive / negative examples

**✓ DO:**
- Colour `Awaiting OpenAI` and `Streaming Response` with the purple "external service" palette (`#F3E5F5`) so the boundary is visually obvious.
- Make `timeout / 5xx` a dashed red transition with the guard `[elapsed > 5 s]` to encode the SRS NFR.

**✗ DO NOT:**
- Collapse `Loading Context` + `Building Prompt` + `Awaiting OpenAI` into one state — they are distinct backend phases and the professor will want to see each.
- Skip the error path — the AI workflow is the most failure-prone one in the system and the Error state is essential.

---

### CRITICAL — REPEATED (sandwich closer)

**MANDATORY:** Nine named states plus start + end. Three-phase backend pipeline (Loading Context → Building Prompt → Awaiting OpenAI). Distinct purple colour for external-service states. Guarded `[elapsed > 5 s]` timeout transition matches the SRS 5 s NFR. Response fields match `AIResponseDTO` exactly. Render PNG + SVG at 200 DPI.

---

## How to run

All five statecharts are generated by one command:

```bash
cd Financial-Management-System
python3 docs/render_statecharts.py
```

Outputs land in `docs/diagrams/`:

- `Statechart_Authentication.png` / `.svg`          — from S1
- `Statechart_ExpenseIncomeLifecycle.png` / `.svg`  — from S2
- `Statechart_TuitionPlanning.png` / `.svg`         — from S3
- `Statechart_WhatIfSimulation.png` / `.svg`        — from S4
- `Statechart_AIAdvisorSession.png` / `.svg`        — from S5

The companion files `docs/render_uml.py` and `docs/render_diagrams2.py` produce the six class diagrams (`ClassDiagram*.png`, `MVC.png`, `ReverseClassDiagram.png`).
