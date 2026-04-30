# Prompt 15 — UML Class Diagram (Frontend Components)
**Phase:** Documentation / Diagrams

---

## Context
Class diagram for the React frontend — showing pages, components, services, and context with their dependencies. React doesn't have classes in the traditional sense, but component relationships and data flow can still be represented as a UML diagram.

---

## Prompt

```
Generate a UML component/class diagram in PlantUML syntax for the FMS React frontend.
Represent React components as classes. Show props as fields, hooks/callbacks as methods.

### Pages (src/pages/)
- LoginPage: uses authService, uses useAuth(), uses useNavigate()
- RegisterPage: uses authService, uses useNavigate()
- DashboardPage: uses dashboardService, renders SummaryCard, Navbar, MonthlyChart
- IncomePage: uses incomeService, renders IncomeForm, Navbar
- ExpensePage: uses expenseService, renders ExpenseForm, Navbar
- TuitionPlannerPage: uses tuitionService, renders Navbar
- PredictionPage: uses predictionService, renders Navbar
- AIAdvisorPage: renders AIChat, Navbar
- SimulationPage: uses simulationService, renders Navbar

### Components (src/components/)
- Navbar: props(none), uses useAuth() for user info and logout
- NumoLogo: props(size, theme)
- SummaryCard: props(title, value, subtitle, tone)
- AIChat: props(className), uses aiService.askQuestion()
- AIChatWidget: renders AIChat in floating panel, manages open/close state
- ProtectedRoute: uses useAuth(), renders Outlet + AIChatWidget

### Context (src/context/)
- AuthContext: state(user, token), methods(login, logout)
- useAuth() hook: consumes AuthContext

### Services (src/services/)
- authService: login(), register(), logout()
- incomeService: getAllIncome(), createIncome(), updateIncome(), deleteIncome()
- expenseService: getAllExpenses(), createExpense(), updateExpense(), deleteExpense()
- dashboardService: getSummary()
- tuitionService: calculate()
- predictionService: getPredictions()
- simulationService: runSimulation()
- aiService: askQuestion()

### Infrastructure (src/api/)
- axiosInstance: axios instance with JWT request interceptor, baseURL=localhost:8080/api

### Relationships to show:
- All services depend on axiosInstance
- All pages that make API calls depend on their respective service
- Pages that need auth state depend on useAuth() / AuthContext
- ProtectedRoute renders Outlet + AIChatWidget
- AIChatWidget renders AIChat
- AIAdvisorPage renders AIChat (full page version)

### Diagram rules:
- Group by folder (pages, components, services, context, api) using package blocks
- Services shown as <<service>> stereotype
- Pages shown as <<page>> stereotype
- Components shown as <<component>> stereotype
- Use dashed arrows for "uses/depends on", solid arrows for "renders/contains"
```
