# Prompt 18 — State Diagram: AI Advisor Chat
**Phase:** Documentation / Diagrams

---

## Context
State diagram for the AI chat widget and advisor page — covering the widget open/close lifecycle and the full message send/receive cycle including loading, error, and retry states.

---

## Prompt

```
Generate a UML state diagram in PlantUML syntax for the AI Financial Advisor Chat feature.
This covers both the floating AIChatWidget and the full AIAdvisorPage (they share the same AIChat component).

### PART A — Widget Lifecycle States

Widget: Closed
  - Initial state
  - Shows floating "Ask Numo" pill button with pulse ring
  - Transition: Closed -> Open: "User clicks Ask Numo button"

Widget: Open
  - Shows chat panel above the button
  - Button label changes to × (close)
  - No pulse ring
  - Transitions:
      Open -> Closed: "User clicks × button"
      Open -> Closed: "User clicks outside the panel (mousedown)"
      Open -> Closed: "User presses Escape key"

### PART B — Chat Session States (inside the panel)

Empty / Idle
  - Initial state of the chat
  - Shows suggestion chips: "Why am I spending so much?", "Am I saving enough?", etc.
  - Transitions:
      Empty -> Sending: "User types a question and clicks Send (or presses Enter)"
      Empty -> Sending: "User clicks a suggestion chip"

Sending
  - Entry action: append user message to messages list, clear input field
  - Shows typing indicator (3 bouncing dots)
  - Disable input and Send button
  - Calls POST /api/ai/ask with { question }
  - Transitions:
      Sending -> Response Received: "200 OK — answer returned"
      Sending -> Error: "Network error or non-200 response"

Response Received
  - Entry action: append AI message bubble to messages list, scroll to bottom
  - Re-enable input and Send button
  - Transition: Response Received -> Sending: "User sends another message"

Error
  - Shows error banner: "Failed to get a response. Please check your connection."
  - Input and Send button re-enabled
  - Transition: Error -> Sending: "User sends a new message"

### PART C — Backend AI Request States (add as a note block)

Received Request (POST /api/ai/ask)
  -> Resolve User from JWT principal
  -> Fetch 10 recent expenses from DB
  -> Fetch 10 recent incomes from DB
  -> Fetch dashboard summary (totals)
  -> Build augmented system prompt
  -> POST to Groq API (Llama 3.3 70B)
  -> Return AIResponseDTO { answer, model }

Groq API States:
  -> Request sent
  -> [200 OK] Parse choices[0].message.content -> return answer
  -> [400/401] Throw RuntimeException (invalid key or bad request)
  -> [timeout] Throw RuntimeException

### Diagram style:
- Use two separate state diagrams: Widget Lifecycle and Chat Session
- Use composite states for the chat session inside the widget
- Show entry actions and guard conditions
- Annotate the backend flow as a note attached to the Sending state
```
