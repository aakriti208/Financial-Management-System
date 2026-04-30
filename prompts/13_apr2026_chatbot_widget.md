# Prompt 13 — Floating AI Chat Widget
**Phase:** UI Polish

---

## Context
The AI advisor currently only exists as a full page at /ai-advisor. Want it accessible from every page as a floating widget — like a customer support chat button. Should use the Numo brand identity: dark navy pill button with the green logo mark and "Ask Numo" label.

---

## Prompt

```
Add a floating AI chat widget to the FMS React frontend that appears on every authenticated page.

---

### src/components/AIChatWidget.jsx

The widget has two states: closed (shows a floating button) and open (shows a chat panel above the button).

#### Floating button (closed state):
- Fixed position: bottom-right corner (fixed bottom-6 right-6 z-50)
- Pill shape (rounded-full), bg-[#0f2035], white text
- Contents (left to right):
    1. NumoMark SVG (22x22px): green (#10b981) rounded square with white N path
    2. Text "Ask Numo" — text-sm font-semibold
- Subtle emerald pulse ring (animate-ping) around the button when closed
- On click: open the chat panel

#### Floating button (open state):
- Same pill, same position
- Text changes to show a × (times/cross) symbol instead of "Ask Numo"
- No pulse ring when open
- On click: close the chat panel

#### Chat panel (open state):
- Positioned above the button (flex-col items-end gap-3)
- Width: w-[360px]
- Dark navy header bar:
    - Left: NumoMark + "Ask Numo" text (white, semibold)
    - Right: × close button (text-slate-400, hover:text-white)
- Body: <AIChat className="h-[420px] rounded-none border-0 shadow-none" />
- Animate in with a custom keyframe: fade in + slide up from 12px below

#### Behavior:
- Close on click outside the panel (mousedown listener on document)
- Close on Escape key
- Use useRef for the panel container for the outside-click check

---

### Modify src/components/AIChat.jsx
Add className prop: function AIChat({ className = 'h-[620px]' })
Apply it to the outer div: <div className={`card flex flex-col ${className}`}>
This allows the widget to pass a compact height without duplicating the component.

---

### Modify src/components/ProtectedRoute.jsx
Add the widget alongside the Outlet so it appears on every authenticated page:
return (
  <>
    <Outlet />
    <AIChatWidget />
  </>
)

---

### Add custom animation to tailwind.config.js (theme.extend):
keyframes: {
  'chat-pop': {
    '0%':   { opacity: '0', transform: 'translateY(12px) scale(0.97)' },
    '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
  }
}
animation: {
  'chat-pop': 'chat-pop 0.18s ease-out forwards'
}

Use animate-chat-pop on the panel div.

---

### NumoMark (inline SVG inside AIChatWidget — do not import NumoLogo)
<svg width="22" height="22" viewBox="0 0 30 30" fill="none">
  <rect width="30" height="30" rx="6.6" fill="#10b981" />
  <path d="M8.1 22.5L8.1 7.5L21.9 22.5L21.9 7.5"
        stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M15.5 7.5L22.9 4.5"
        stroke="white" strokeWidth="1.65" strokeLinecap="round" opacity="0.6"/>
</svg>

IMPORTANT: Do not show the widget on /login or /register pages.
Since it's rendered inside ProtectedRoute, unauthenticated users will never see it.
```
