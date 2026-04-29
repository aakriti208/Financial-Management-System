# Prompt 22 — Frontend Component & Integration Tests
**Phase:** Testing

---

## Context
Frontend testing with Vitest and React Testing Library. Testing component rendering, user interactions, service call integration, and auth-gated routing. Mock all API calls — tests should never hit the real backend.

---

## Prompt

```
Generate frontend tests using Vitest + React Testing Library.
File structure: src/__tests__/ for unit tests, src/__tests__/integration/ for flow tests.
Mock all service modules with vi.mock(). Wrap components in necessary providers.

---

### Setup file (src/setupTests.js)
- Import @testing-library/jest-dom for extended matchers (toBeInTheDocument, toHaveValue, etc.)

### Test wrapper utility (src/__tests__/utils/renderWithProviders.jsx)
Helper that wraps any component with MemoryRouter + AuthProvider so hooks work in tests.

---

### SummaryCard.test.jsx

renders title and formatted value
  render <SummaryCard title="Total Income" value="$1,500.00" />
  expect(screen.getByText("Total Income")).toBeInTheDocument()
  expect(screen.getByText("$1,500.00")).toBeInTheDocument()

applies emerald color class when tone is positive
  render with tone="positive"
  expect value element to have class containing "emerald"

applies rose color class when tone is negative
  render with tone="negative"
  expect value element to have class containing "rose"

renders subtitle when provided
  render with subtitle="All time"
  expect(screen.getByText("All time")).toBeInTheDocument()

---

### LoginPage.test.jsx

renders email and password fields
  expect(screen.getByPlaceholderText(...)).toBeInTheDocument() for both fields

disables submit button while loading
  mock authService.login to return a never-resolving promise
  submit form, assert button is disabled during loading

shows error message on failed login
  mock authService.login to throw { response: { data: { message: "Invalid credentials" } } }
  submit form, await error banner
  expect(screen.getByText("Invalid credentials")).toBeInTheDocument()

clears error when user starts typing again
  trigger error, then simulate typing in email field
  expect error banner to disappear

navigates to /dashboard on success
  mock authService.login to resolve with { token, email, firstName, lastName }
  submit form, assert navigation to /dashboard occurs

---

### AIChat.test.jsx

renders suggestion chips when empty
  expect("Why am I spending so much this month?") to be in the document
  expect("Am I saving enough from my income?") to be in the document

sends message when user clicks Send
  mock aiService.askQuestion resolving with { answer: "You are doing great!" }
  type a question in input, click Send
  expect user message bubble appears
  await AI response bubble appears with "You are doing great!"

shows typing indicator while waiting for response
  mock aiService.askQuestion to return a slow-resolving promise
  send a message, expect typing indicator (3 dots) to be visible

shows error banner when API call fails
  mock aiService.askQuestion to throw an error
  send a message, expect error banner

disables Send button when input is empty
  expect Send button to have disabled attribute initially

---

### ProtectedRoute.test.jsx

redirects to /login when user is not authenticated
  render ProtectedRoute with AuthContext user=null
  expect navigation to /login

renders Outlet content when user is authenticated
  render ProtectedRoute with AuthContext user={email, firstName, lastName}
  expect child route content to render

renders AIChatWidget when authenticated
  expect AIChatWidget floating button to be in the document

---

### authService.test.js

login calls POST /auth/login with correct body
  vi.mock('../api/axiosInstance')
  call login({ email, password })
  assert api.post called with '/auth/login' and the payload

login stores token in localStorage on success
  mock api.post to resolve with { data: { token: 'abc123', ... } }
  call login(...)
  expect localStorage.getItem('token') == 'abc123'

register calls POST /auth/register
  call register({ firstName, lastName, email, password })
  assert api.post called with '/auth/register'

logout removes token and user from localStorage
  set localStorage items first
  call logout()
  expect localStorage.getItem('token') == null
  expect localStorage.getItem('user') == null

---

### Conventions:
- Use screen.getBy* for synchronous assertions, await findBy* for async
- Use userEvent.type() and userEvent.click() (not fireEvent) for user interactions
- Always clean up localStorage in afterEach
- Use vi.clearAllMocks() in afterEach to reset mock state
```
