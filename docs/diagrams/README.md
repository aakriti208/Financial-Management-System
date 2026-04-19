# UML Class Diagrams — Financial Management System

These are the class diagrams that accompany the submission (SRS §submission item #3).

| File | Purpose | Layout |
|------|---------|--------|
| `ClassDiagram.png` / `.svg` | **Overview** — layered architecture (Frontend → REST → Services → Repositories → Entities → PostgreSQL, plus Security and OpenAI external) | Portrait, 6 packages, single column |
| `ClassDiagram_Backend.png` / `.svg` | **Backend detail** — every Spring Boot class with attributes, methods, and stereotypes (`@Entity`, `@RestController`, `@Service`, `JpaRepository`, `@Configuration`) | ~30 classes across 6 packages |
| `ClassDiagram_Frontend.png` / `.svg` | **Frontend detail** — React 18 structure: `AuthContext`, `axiosInstance`, services, pages, components | ~27 modules across 5 packages |

## Conventions used in the diagrams

- Solid arrow (filled triangle): **association / "uses"** (e.g., Controller → Service)
- Dashed arrow (open arrow): **dependency / realization** (e.g., Impl → interface, Repository → Entity)
- Dashed arrow with empty triangle: **interface realization** (Impl ..|> Interface)
- Filled diamond at tail + line: **composition** (`User` composes `Income` / `Expense` / `TuitionPlan` with multiplicity `1..*`)
- Open diamond at tail: **aggregation** (`DashboardPage` aggregates `SummaryCard`, `BudgetChart`)
- Dotted arrow: **HTTP / network boundary** (frontend `axiosInstance` → backend controllers)
- Stereotypes are shown as `«...»` above the class name.

## Source files

- `ClassDiagram.puml` — PlantUML source (the canonical, editable representation of the full stack). Can be re-rendered with PlantUML if you have it installed: `plantuml ClassDiagram.puml`.
- `ClassDiagram` / `ClassDiagram_Backend` / `ClassDiagram_Frontend` (no extension) — raw Graphviz DOT emitted by the render script; kept for transparency.
- `../../render_uml.py` — Python 3 script that builds the three Graphviz diagrams and writes PNG + SVG output to this folder. Re-run with `python3 render_uml.py` after editing.

## Rendering environment

- Graphviz 2.43 (`dot`) — used to produce PNG and SVG
- Python 3 + `graphviz` package
- Rendered at 180–200 DPI for print-friendly output
