# Diagram Prompts — Financial Management System

**CS 5394 Software Engineering · Group 2**
Aakriti Dhakal · Agnes Jesionowska · Manoj Khanal

This document contains the three prompts used to generate the three supplementary UML diagrams for our Financial Management System (FMS) submission:

1. **D1 — Class Diagram** (`ClassDiagram_v2.png` / `.svg`) — clean domain-model view
2. **D2 — MVC Diagram** (`MVC.png` / `.svg`) — three-column Model–View–Controller package view
3. **D3 — Reverse Class Diagram** (`ReverseClassDiagram.png` / `.svg`) — IDE-style diagram reverse-engineered from the actual source code

All three prompts follow the prompt-engineering principles defined in `promptGuidelines.docx`:

- **Sandwich Method** — the most important instructions appear both at the top and repeated at the bottom so they are not lost in the middle of the context window.
- **Attention Anchoring** — `MANDATORY`, `CRITICAL`, `MUST`, `DO NOT` in capitals to focus the model on non-negotiable constraints.
- **Visual Emphasis** — bold, ALL CAPS, and checkmark/cross indicators for positive/negative examples.
- **Clear Delimiters** — `###` headings and triple-backtick code fences to separate sections.
- **Selective Context** — only the parts of SRS / source that are relevant to a given diagram are included.

All three diagrams are rendered by a single script, `docs/render_diagrams2.py`, which uses Python 3 + the Graphviz DOT engine. Re-render with:

```bash
python3 docs/render_diagrams2.py
```

---

## D1 — Class Diagram Prompt

### CRITICAL — READ FIRST

**MANDATORY:** Produce ONE clean UML class diagram that shows the **domain model** of the Financial Management System. The diagram MUST emphasise the four JPA entities (User, Income, Expense, TuitionPlan) and the DTO families that wrap them. The diagram MUST use **standard UML notation** — NO free-form boxes, NO proprietary IDE styling.

**DO NOT** include repositories, controllers, services, Spring configuration classes, or the React frontend in this diagram. Those belong in D2 (MVC) and D3 (Reverse). This diagram is a **business-domain view** only.

---

### Context

```
Project:   Financial Management System (FMS)
Reference: SRS_Draft.pdf v1.0 §3.1.1–3.1.9
Stack:     Spring Boot 3 + Java 17 + JPA (backend)
Source:    backend/src/main/java/com/fms/{model,dto}/
```

The FMS lets international students register, log in, and manage their income, expenses, tuition planning, expense prediction, what-if simulation, and an AI financial advisor. Every transactional record (Income, Expense, TuitionPlan) belongs to a single authenticated User; a User has 1..* of each.

---

### Required content

The diagram MUST contain the following five clusters, in this order:

1. **Domain Entities (`com.fms.model`)** — `User`, `Income`, `Expense`, `TuitionPlan`
2. **Authentication DTOs** — `RegisterRequest`, `LoginRequest`, `AuthResponse`
3. **Transactional DTOs** — `IncomeDTO`, `ExpenseDTO`
4. **Analytical / Calculation DTOs** — `DashboardSummaryDTO`, `TuitionRequestDTO`, `TuitionResultDTO`, `SimulationRequestDTO`, `SimulationResultDTO`
5. **AI Advisor DTOs** — `AIQueryDTO`, `AIResponseDTO`

Each class box MUST show:

- Stereotype line — `«@Entity»` for JPA entities, `«DTO»` for DTOs.
- Class name — bold, centred.
- Attributes compartment — visibility prefix (`-`/`+`/`#`), name, colon, Java type. Include Bean Validation annotations inline (e.g., `@NotBlank`, `@Email`, `@DecimalMin`, `@Size(min=8)`, `@Min(1)`, `@Max(60)`) where the SRS specifies validation.
- Methods compartment — only for entities (getters, setters, `@PrePersist onCreate()`); DTOs are data-only.

---

### Required relationships

| Relationship | UML notation | Between |
|---|---|---|
| **Composition** (filled diamond) | `User ◆—— Income (1..*)` | `User → Income`, `User → Expense`, `User → TuitionPlan` |
| **Aggregation** (open diamond) | `DashboardSummaryDTO ◇—— IncomeDTO (0..*)` | `DashboardSummaryDTO → IncomeDTO`, `DashboardSummaryDTO → ExpenseDTO` |
| **Dependency / mapping** (dashed arrow with open head, labelled `maps`) | `IncomeDTO ┈┈> Income` | `IncomeDTO → Income`, `ExpenseDTO → Expense`, `TuitionResultDTO → TuitionPlan`, `AuthResponse → User` |

**CRITICAL:** Multiplicities MUST be shown. Use `1` on the owning side and `1..*` on the composed side.

---

### Rendering constraints

- **Portrait** orientation; rendered with Graphviz DOT via `render_diagrams2.py`.
- Output **BOTH** PNG and SVG at 180 DPI.
- Colour-code clusters for quick scanning (green = entity, orange = auth DTO, yellow = transactional DTO, blue = analytical DTO, pink = AI DTO).
- Each cluster MUST be a labelled Graphviz subgraph (`cluster_*`) with a filled background.

---

### Positive / negative examples

**✓ DO:**
- `User ◆——1..*—— Income` (composition, 1 User to many Income)
- `IncomeDTO ──maps──> Income` (dashed, open arrow)

**✗ DO NOT:**
- Draw `AuthController`, `UserRepository`, or any Spring component.
- Show React classes.
- Use plain arrows without multiplicities on the composition edges.
- Mix up composition (filled diamond) with aggregation (open diamond).

---

### CRITICAL — REPEATED (sandwich closer)

**MANDATORY:** This is a **domain-model class diagram only**. Entities + DTOs + their relationships. No controllers, no repositories, no services, no frontend. Use standard UML notation with composition (filled diamond), aggregation (open diamond), and dependency (dashed arrow with open head). Render to PNG + SVG in portrait orientation.

---
---

## D2 — MVC Diagram Prompt

### CRITICAL — READ FIRST

**MANDATORY:** Produce a **three-package UML diagram** showing the Model–View–Controller pattern as implemented in the Financial Management System. Layout MUST be **Model | View | Controller** packages rendered as labelled, coloured "tabbed package" rectangles side by side. Arrows crossing the package boundaries MUST show the actual request flow.

**DO NOT** produce a simple class diagram. This is a **pattern / architecture diagram**. Every class that appears MUST sit inside exactly one of the three packages.

---

### Context

```
Project:   Financial Management System (FMS)
Reference: SRS_Draft.pdf v1.0 §3.1 (all 9 functional requirements)
Pattern:   Model–View–Controller
Stack:     Spring Boot 3 (backend) + React 18 + Vite (frontend)
```

The FMS follows a strict MVC separation:

- **Model** — `com.fms.model` (JPA entities) + `com.fms.repository` (JpaRepository interfaces) + `com.fms.service` (business services) + PostgreSQL.
- **View** — `frontend/src/pages`, `frontend/src/components`, `frontend/src/context/AuthContext`, `frontend/src/services`, `frontend/src/api/axiosInstance`.
- **Controller** — `com.fms.controller` (8 `@RestController` classes) + `com.fms.config.SecurityConfig` + `JwtAuthFilter`.

---

### Required content per package

#### MODEL package — must contain:

- `User`, `Income`, `Expense`, `TuitionPlan` entities — each with id, key fields, and Lombok note.
- `UserRepository`, `IncomeRepository`, `ExpenseRepository`, `TuitionPlanRepository` — each with ONLY the methods actually declared (e.g., `findByEmail`, `findByUser`, `findByUserOrderByDateDesc`).
- **Consolidated node** `Business Services (8)` listing all eight service interface + impl names.

#### VIEW package — must contain:

- All 9 pages — `LoginPage`, `RegisterPage`, `DashboardPage`, `IncomePage`, `ExpensePage`, `TuitionPlannerPage`, `PredictionPage`, `SimulationPage`, `AIAdvisorPage`.
- All 9 components — `Navbar`, `ProtectedRoute`, `SummaryCard`, `BudgetChart`, `IncomeForm`, `ExpenseForm`, `TuitionForm`, `SimulationForm`, `AIChat`.
- `AuthContext` — the React context providing `user`, `token`, `isAuthenticated`, `login()`, `logout()`.

#### CONTROLLER package — must contain:

- 8 `@RestController` classes — `AuthController`, `IncomeController`, `ExpenseController`, `DashboardController`, `TuitionController`, `PredictionController`, `SimulationController`, `AIAdvisorController` — each with its HTTP method + path.
- `SecurityConfig` and `JwtAuthFilter`.

---

### Required cross-package relationships

| From | To | Meaning | Style |
|---|---|---|---|
| `Page` (View) | `Controller` (Controller) | HTTP request via axios | dashed arrow, label `«use»` |
| `ProtectedRoute` / `Navbar` | `AuthContext` | React consumer | dashed arrow, label `«use»` |
| `JwtAuthFilter` | every non-auth `Controller` | request gate | dashed arrow, label `«filter»` |
| `Controller` | `Business Services (8)` | service call | dashed arrow, label `«use»` |
| `Business Services (8)` | `*Repository` | JPA call | solid arrow |
| `*Repository` | `Entity` | manages | dashed arrow, open head |
| `User` | `Income`, `Expense`, `TuitionPlan` | composition | filled diamond at User side, `1..*` multiplicity |
| `Page` (e.g., DashboardPage) | `Component` (e.g., SummaryCard) | composition | filled diamond |

---

### Rendering constraints

- **Landscape** orientation (`rankdir=LR`).
- Each package is a Graphviz cluster styled as a **rounded, light-blue tabbed folder** with a bold package label (View / Model / Controller) at the top.
- Classes inside a package are simple white rectangles with a bold class-name row and compartments for attributes and methods — **no stereotype row** (MVC diagram is about position, not type).
- Output PNG + SVG.

---

### Positive / negative examples

**✓ DO:**
- `LoginPage ──«use»──> AuthController` crossing the View-to-Controller boundary.
- `UserRepository ──«manages»──> User` inside the Model package.
- Filled diamond at `User` tail to `Income`, `Expense`, `TuitionPlan`.

**✗ DO NOT:**
- Draw React pages inside the Controller package.
- Draw `@RestController` classes in the Model package.
- Render a plain class diagram without the three package "folders" — if the View/Model/Controller labels are not visible as tabbed package headers, the diagram fails its purpose.
- Put every Spring service as its own node (use the consolidated `Business Services (8)` node to keep the diagram readable).

---

### CRITICAL — REPEATED (sandwich closer)

**MANDATORY:** Three labelled tabbed packages — **View**, **Controller**, **Model** — with the project's React + Spring Boot classes placed in the correct package. Arrows that cross package boundaries (dashed `«use»`, `«filter»`) MUST show the end-to-end request flow: React page → REST controller → service → repository → entity → PostgreSQL. Render landscape at 180 DPI, PNG + SVG.

---
---

## D3 — Reverse Class Diagram Prompt

### CRITICAL — READ FIRST

**MANDATORY:** Produce a **reverse-engineered class diagram** that reflects the CURRENT state of the source code — NOT the target design. The diagram MUST visually match the **IDE-generated "ObjectAid / Eclipse UML2" style**: pale-yellow class boxes with a `«Java Class»` or `«Java Interface»` stereotype header and the Java **package path shown below the class name in a smaller grey font**.

**DO NOT** fabricate methods, fields, or relationships. Every attribute, every method signature, and every TODO marker MUST come directly from the `.java` files in `backend/src/main/java/com/fms/`. If a method returns `null` with `// TODO` comments in the source, that MUST be visible in the diagram (e.g., as `// TODO: returns null`).

---

### Context

```
Project:   Financial Management System (FMS)
Source:    backend/src/main/java/com/fms/
Status:    ~40–50% scaffolded — many methods are TODO stubs that return null
Reference: SRS_Draft.pdf §3.1 (for intended behaviour)
```

---

### MANDATORY accuracy rules

The diagram MUST reflect the actual source, specifically:

1. **Entities** use Lombok `@Data` + `@NoArgsConstructor` + `@AllArgsConstructor`. Methods row MUST read `(Lombok) getters/setters` — DO NOT enumerate every generated getter.
2. **`User` and `TuitionPlan`** have an `@PrePersist` method `onCreate()` — show it.
3. **`createdAt`** on `User` and `TuitionPlan` is `LocalDateTime` (NOT `Instant`).
4. **`Income` / `Expense`** use `@ManyToOne(fetch=LAZY)` to `User`.
5. **Entity tables** are `users`, `income` (NOT `incomes`), `expenses`, `tuition_plans`.
6. **`DashboardSummaryDTO`** has `totalIncome`, `totalExpenses`, `netBalance`, `recentIncome : List<IncomeDTO>`, `recentExpenses : List<ExpenseDTO>` and NOTHING ELSE. It does NOT have `expenseByCategory` — that is only a TODO comment.
7. **`TuitionResultDTO`** has `tuitionPerCourse`, `numberOfCourses`, `scholarshipAmount`, `grossTuition`, `netTuition` — NOT `totalTuition` / `affordable` / `message`.
8. **`SimulationResultDTO`** has `projectedFinalBalance`, `projectedTotalSavings`, `monthlyBalances : List<BigDecimal>` — NOT `hypoSurplus` / `verdict` / `timeline`.
9. **Repositories** have ONLY `findByUser(User)` and `findByUserOrderByDateDesc(User)` / `findByUserOrderByCreatedAtDesc(User)` — NO `findByUserAndDateBetween`, NO `sumByCategory`.
10. **Services** take `String userEmail` as the **first explicit parameter** (NOT via SecurityContextHolder). Example: `IncomeService.getAllByUser(String userEmail) : List<IncomeDTO>`.
11. **All `*ServiceImpl`** classes currently return `null` for every method — show this as `// TODO: returns null` in the methods row and tag the class with `«TODO-stub»`.
12. **`AIAdvisorServiceImpl`** has `@Value("${openai.api.key}") private String openAiApiKey` — show as a field.
13. **`ExpensePredictionService`** has method `predictNextMonthExpenses(String userEmail) : List<ExpenseDTO>` — NOT a `PredictionResultDTO` return. There is NO `PredictionResultDTO` class in the source.
14. **Controllers** use `@AuthenticationPrincipal UserDetails userDetails` + `@RequiredArgsConstructor` + `final` service fields. Each REST endpoint method currently returns `null`.
15. **`JwtAuthFilter` does NOT exist as a class yet.** `SecurityConfig.securityFilterChain()` contains a `// TODO: add JwtAuthenticationFilter` comment. Represent `JwtAuthFilter` as a dashed placeholder node labelled `«TODO — class not yet created»`. This is important for the professor to see our current progress.
16. **`JwtUtil`** has three methods (`generateToken`, `validateToken`, `extractEmail`) that are ALL TODO stubs returning `null` / `false` — show this.

---

### Required UML elements (all from actual source)

- **Entities** (`com.fms.model`): `User`, `Income`, `Expense`, `TuitionPlan`.
- **DTOs** (`com.fms.dto`): `RegisterRequest`, `LoginRequest`, `AuthResponse`, `IncomeDTO`, `ExpenseDTO`, `DashboardSummaryDTO`, `TuitionRequestDTO`, `TuitionResultDTO`, `SimulationRequestDTO`, `SimulationResultDTO`, `AIQueryDTO`, `AIResponseDTO`.
- **Repositories** (`com.fms.repository`): `UserRepository`, `IncomeRepository`, `ExpenseRepository`, `TuitionPlanRepository` — marked `«Java Interface»`.
- **Service interfaces + impls** (`com.fms.service`): 8 interfaces + 8 `*ServiceImpl` classes.
- **Controllers** (`com.fms.controller`): 8 `@RestController` classes.
- **Config** (`com.fms.config`): `SecurityConfig`, `JwtUtil`, `CorsConfig` + TODO placeholder for `JwtAuthFilter`.
- **Entry point** (`com.fms`): `FmsApplication` with `@SpringBootApplication`.

---

### Required relationships (from source imports + `@` annotations)

- `User ◆——0..*—— Income` / `Expense` / `TuitionPlan` (filled diamond, multiplicity).
- `*Repository ┈┈«manages»┈┈> Entity` (dashed, open arrow).
- `*ServiceImpl ┈┈▷ *Service` (dashed, empty triangle — realization).
- `*ServiceImpl ┈┈> *Repository` (dashed, open head — dependency).
- `*Controller ───> *Service` (solid vee).
- `SecurityConfig ┈┈> JwtUtil` and `SecurityConfig ┈┈«TODO»┈┈> JwtAuthFilter`.

---

### Rendering constraints

- Each class is a **Graphviz HTML-label table** with:
  - Row 1: `«Java Class»` or `«Java Interface»` centred on a slightly darker yellow (`#FFF59D`).
  - Row 2: class name, bold, centred.
  - Row 3: package path (e.g., `com.fms.service`) in 9-pt grey.
  - Horizontal rule.
  - Attribute rows (10 pt).
  - Horizontal rule.
  - Method rows (10 pt).
- Body fill: `#FFFDE7` (pale yellow, matches the sample).
- No cluster boxes — classes are laid out in a sprawling grid of connected nodes (this is the IDE look).
- Render landscape at 170 DPI, PNG + SVG.

---

### Positive / negative examples

**✓ DO:**
- Show `AuthServiceImpl.register()` as `+ register() : AuthResponse  // TODO: returns null`.
- Show `DashboardSummaryDTO` with exactly 5 fields (NO `expenseByCategory`).
- Show `JwtAuthFilter` as a dashed placeholder node labelled `«TODO — class not yet created»`.

**✗ DO NOT:**
- List every Lombok-generated accessor individually.
- Invent methods that do not appear in the source (e.g., DashboardService does NOT have `getMonthlyBreakdown()`).
- Draw `JwtAuthFilter` as a real class — it does not exist yet.
- Mix in design-phase DTO fields (e.g., `TuitionResultDTO.affordable`) that are not in the `.java` file.

---

### CRITICAL — REPEATED (sandwich closer)

**MANDATORY:** This is a **reverse** class diagram. Every attribute, every method signature, every TODO marker MUST match the current source exactly. Style: IDE-generated — pale-yellow class boxes with `«Java Class»`/`«Java Interface»` headers and package path under the class name. Include the `«TODO — class not yet created»` placeholder for `JwtAuthFilter`. All `*ServiceImpl` methods currently return `null` — annotate them as `// TODO: returns null`. Render landscape at 170 DPI, PNG + SVG.

---

## How to run

All three diagrams are generated by one command:

```bash
cd Financial-Management-System
python3 docs/render_diagrams2.py
```

Outputs land in `docs/diagrams/`:

- `ClassDiagram_v2.png` / `.svg` — from D1
- `MVC.png` / `.svg` — from D2
- `ReverseClassDiagram.png` / `.svg` — from D3

The companion file `docs/render_uml.py` produces the earlier Overview / Backend / Frontend diagrams (`ClassDiagram.png`, `ClassDiagram_Backend.png`, `ClassDiagram_Frontend.png`).
