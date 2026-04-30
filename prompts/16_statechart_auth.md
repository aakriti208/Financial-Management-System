# Prompt 16 — State Diagram: Authentication Flow
**Phase:** Documentation / Diagrams

---

## Context
State diagram for the full authentication lifecycle — from the user arriving unauthenticated, through registration and login, to token expiry and logout. This maps directly to how JwtAuthFilter and AuthContext work together.

---

## Prompt

```
Generate a UML state diagram in PlantUML syntax for the Authentication flow in the FMS application.

### States to include:

Unauthenticated
  - Initial state (app entry point)
  - Transitions: "Visit /login" -> Login Form, "Visit /register" -> Register Form

Register Form
  - Sub-states: Idle, Validating, Submitting, Error
  - Transitions:
      Idle -> Validating: "User fills form and clicks Register"
      Validating -> Error: "Client validation fails (e.g. password < 8 chars)"
      Validating -> Submitting: "Validation passes"
      Submitting -> Error: "409 Conflict (email already exists)"
      Submitting -> Authenticated: "201 Created — token received"
      Error -> Idle: "User edits form"

Login Form
  - Sub-states: Idle, Submitting, Error
  - Transitions:
      Idle -> Submitting: "User submits credentials"
      Submitting -> Error: "401 Unauthorized — wrong password"
      Submitting -> Authenticated: "200 OK — token received"
      Error -> Idle: "User retries"

Authenticated
  - Entry action: store JWT in localStorage, set AuthContext user state
  - Internal transitions:
      "JWT valid" -> remains Authenticated
      "Request made" -> JWT attached via Axios interceptor
  - Transitions:
      Authenticated -> Token Expired: "JWT expiry (24 hours)"
      Authenticated -> Unauthenticated: "User clicks Logout"

Token Expired
  - Entry action: clear localStorage, clear AuthContext state
  - Transition: Token Expired -> Login Form: "Redirect to /login"

Unauthenticated (revisited)
  - Any protected route access -> redirect to /login via ProtectedRoute

### Notes to add as diagram annotations:
- JWT is stored in localStorage key "token"
- Token lifetime = 24 hours (configurable via jwt.expiration-ms)
- JwtAuthenticationFilter validates token on every request
- ProtectedRoute checks AuthContext.user — if null, redirects to /login

### Diagram style:
- Use [*] for initial and final states
- Use composite states (state X { }) for states with sub-states
- Add entry / and do / actions where relevant
- Keep it readable — this goes on a presentation slide
```
