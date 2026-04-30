# Prompt 08 — Frontend Pages & Components
**Phase:** Frontend UI

---

## Context
Core infrastructure is working — auth, routing, and services are all set. Now building all the pages and reusable components. Design language: dark navy (#0f2035) as primary, emerald green (#10b981) as accent, slate grays for text. Font: Plus Jakarta Sans.

---

## Prompt

```
Build all pages and components for the FMS React frontend.
Design: Tailwind CSS, dark navy (#0f2035) primary, emerald (#10b981) accent.
All components are in src/components/, all pages in src/pages/.

---

### SHARED COMPONENTS

#### Navbar.jsx
- Sticky top bar, bg-[#0f2035], white text
- Left: NumoLogo component
- Center nav links: Dashboard, Income, Expenses, Tuition, Prediction, AI Advisor
  Use NavLink — active link gets emerald underline border-b-2 border-emerald-400
- Right: "Hi, {user.firstName}" + Logout button
- On mobile: collapse links into a hamburger menu

#### NumoLogo.jsx
- SVG mark: rounded green (#10b981) square with white stylised "N" path
- Wordmark: "NUMO" in extrabold tracking-tight
- Props: size (sm/md/lg), theme (dark/light) — theme controls wordmark color

#### SummaryCard.jsx
Props: title, value, subtitle, tone (positive | negative | neutral)
- White rounded card, shadow
- title: small gray uppercase label
- value: large bold number, color driven by tone (emerald=positive, rose=negative, slate=neutral)
- subtitle: small muted text below value

---

### PAGES

#### LoginPage.jsx
- Split layout: left dark navy panel with NumoLogo and feature bullets, right login form
- Form: email, password inputs + "Sign in" submit button
- On submit: call loginService, then auth.login(), navigate to /dashboard
- Show error banner on failure, loading state on button

#### RegisterPage.jsx
- Similar layout to login
- Fields: firstName, lastName, email, password (min 8 chars)
- On success: navigate to /login with a success message in location.state

#### DashboardPage.jsx
- 3 SummaryCards at top: Total Income, Total Expenses, Net Balance
- Recharts BarChart (ResponsiveContainer) showing last 6 months income vs expenses side by side
- Two tables below: 5 most recent income entries, 5 most recent expense entries
- Loading skeleton and error state

#### IncomePage.jsx + ExpensePage.jsx (symmetric)
- Add form at top (inline, not modal)
- Table of all records: date | amount | source/category | type | description | Edit | Delete
- Edit populates form; Delete shows confirm then re-fetches list
- Success/error toast banners

#### TuitionPlannerPage.jsx
- Input form: tuition per course, number of courses, scholarship amount
- On submit: show result card with gross tuition, net tuition, current savings, monthly surplus, advice message
- Color code result: green if affordable, amber if close, red if not affordable

#### PredictionPage.jsx
- On load: call getPredictions(), show table of predicted next-month expenses by category
- Each row: category, predicted amount, expense type, necessity badge
- Empty state if no history

#### AIAdvisorPage.jsx
- Full page chat layout using the AIChat component
- Header: "AI Financial Advisor" with subtitle

#### AIChat.jsx (reusable component)
Props: className (for height override, default h-[620px])
- Suggestion chips when empty: "Why am I spending so much?", "Am I saving enough?", etc.
- Message bubbles: user (right, dark navy), AI (left, slate with ✦ avatar)
- Typing indicator (3 bouncing dots) while loading
- Input bar at bottom with Send button
- Scroll to bottom on new messages
- On send: call aiService.askQuestion(text)

#### SimulationPage.jsx
- Form: hypothetical monthly income, hypothetical monthly expenses, months to project
- On submit: show projected ending balance, monthly surplus, verdict badge
- Recharts LineChart of projected balance over time

### MANDATORY
- Every page has loading and error states
- Currency formatted with Intl.NumberFormat en-US USD
- No component calls axios directly — all calls go through service files
```
