# Prompt 07 — Frontend Core (Auth, Routing, Services)
**Phase:** Frontend Foundation

---

## Context
Backend APIs are all working. Starting the React frontend. Need the auth context, axios setup with JWT interceptor, routing structure, and all the service files that wrap the API calls. Components will be built on top of this in the next sprint.

---

## Prompt

```
Build the core frontend infrastructure for the FMS React app.
Stack: React 18, Vite 5, Tailwind CSS 3, React Router v6, Axios.

---

### 1. src/api/axiosInstance.js
- axios.create with baseURL: "http://localhost:8080/api"
- Request interceptor: attach Authorization: Bearer <token> from localStorage key "token"
- No response interceptor yet (TODO comment for 401 handling)
export default as `api`

### 2. src/context/AuthContext.jsx
State: user ({ email, firstName, lastName }), token
- Initialize from localStorage on mount (keys: "token" and "user")
- login(userData, jwtToken): setUser, setToken, write both to localStorage
- logout(): clear state and localStorage
- Throw error if useAuth() is called outside AuthProvider
Export: AuthProvider, useAuth

### 3. src/components/ProtectedRoute.jsx
- useAuth() to get user
- If no user: <Navigate to="/login" replace />
- Otherwise: <Outlet />

### 4. src/App.jsx
Wrap everything in <Router> and <AuthProvider>.
Routes:
  Public:  /login -> LoginPage, /register -> RegisterPage
  Protected (inside <Route element={<ProtectedRoute/>}>):
    /dashboard  -> DashboardPage
    /income     -> IncomePage
    /expenses   -> ExpensePage
    /tuition    -> TuitionPlannerPage
    /prediction -> PredictionPage
    /ai-advisor -> AIAdvisorPage
    /simulation -> SimulationPage
  Fallback: / -> Navigate to /dashboard, * -> Navigate to /dashboard

### 5. Service files under src/services/ (one file per resource)
Each exports named async functions. All return response.data. No try/catch inside services.

authService.js:
  register(userData) -> POST /auth/register, store token+user in localStorage, return data
  login(credentials) -> POST /auth/login, store token+user in localStorage, return data
  logout()           -> remove token and user from localStorage

incomeService.js:
  getAllIncome()                    -> GET /income
  createIncome(dto)                 -> POST /income
  updateIncome(id, dto)             -> PUT /income/{id}
  deleteIncome(id)                  -> DELETE /income/{id}

expenseService.js  (same pattern as income, path /expenses)

dashboardService.js:
  getSummary()  -> GET /dashboard/summary

tuitionService.js:
  calculate(dto) -> POST /tuition/calculate

predictionService.js:
  getPredictions() -> GET /prediction/expenses

simulationService.js:
  runSimulation(dto) -> POST /simulation/run

aiService.js:
  askQuestion(question) -> POST /ai/ask with body { question }, return data
```
