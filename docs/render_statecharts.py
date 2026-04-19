"""Render UML Statechart Diagrams for the Financial Management System.

Produces FIVE statecharts, one per core workflow:
  S1  Authentication.png                — Create Account + Login + Session + Logout
  S2  ExpenseIncomeLifecycle.png        — Record CRUD (Draft → Persisted → Deleted)
  S3  TuitionPlanning.png               — Calculate tuition workflow
  S4  WhatIfSimulation.png              — Scenario configuration + projection
  S5  AIAdvisorSession.png              — Ask → OpenAI call → Response display

All charts use UML-standard notation:
    ● initial state       (filled small circle)
    ◉ final state         (double circle, inner filled)
    rounded rectangles    for named states (optional /entry, /do, /exit lines)
    transitions labelled  "trigger [guard] / action"

Same Graphviz DOT stack as the class diagrams.
"""
from pathlib import Path
from graphviz import Digraph

OUT_DIR = Path("/sessions/zealous-nice-faraday/mnt/Financial-Management-System/docs/diagrams")
OUT_DIR.mkdir(parents=True, exist_ok=True)


# =============================================================================
# Shared helpers
# =============================================================================
def base_graph(title, width_in=14, height_in=10, dpi=200, rankdir="TB"):
    g = Digraph(format="png")
    g.attr(rankdir=rankdir,
           splines="spline",
           nodesep="0.55",
           ranksep="0.9",
           fontname="Helvetica",
           fontsize="18",
           dpi=str(dpi),
           bgcolor="white",
           size=f"{width_in},{height_in}!",
           newrank="true",
           compound="true",
           label=title,
           labelloc="t",
           labeljust="c",
           pad="0.4")
    g.attr("node", fontname="Helvetica", fontsize="12")
    g.attr("edge", fontname="Helvetica", fontsize="10",
           arrowsize="0.9", penwidth="1.2")
    return g


def state(g, nid, name, actions=None, fill="#E3F2FD", border="#1565C0"):
    """UML state: rounded rectangle with name, optional action list."""
    parts = [f'<TABLE BORDER="0" CELLBORDER="0" CELLSPACING="0" CELLPADDING="4">']
    parts.append(f'<TR><TD ALIGN="CENTER"><B>{name}</B></TD></TR>')
    if actions:
        parts.append('<HR/>')
        for a in actions:
            parts.append(f'<TR><TD ALIGN="LEFT"><FONT POINT-SIZE="10">{a}</FONT></TD></TR>')
    parts.append('</TABLE>')
    g.node(nid,
           label="<" + "".join(parts) + ">",
           shape="rectangle",
           style="rounded,filled",
           fillcolor=fill,
           color=border,
           penwidth="1.6")


def start(g, nid="start"):
    g.node(nid, label="", shape="circle", style="filled",
           fillcolor="black", color="black", width="0.28", height="0.28",
           fixedsize="true")
    return nid


def end(g, nid="end"):
    # UML final state: small filled black circle inside a ring
    g.node(nid, label="", shape="doublecircle",
           style="filled", fillcolor="black",
           color="black", width="0.32", height="0.32",
           fixedsize="true", penwidth="1.4")
    return nid


def t(g, src, dst, trigger="", guard="", action="", color="#37474F",
      style="solid"):
    """Transition with UML label format: trigger [guard] / action"""
    label_parts = []
    if trigger:
        label_parts.append(trigger)
    if guard:
        label_parts.append(f"[{guard}]")
    if action:
        label_parts.append(f"/ {action}")
    label = " ".join(label_parts)
    g.edge(src, dst, label=label, color=color, fontcolor=color,
           arrowhead="vee", style=style)


# =============================================================================
# S1 — AUTHENTICATION STATECHART  (SRS §3.1.1 + §3.1.2)
# =============================================================================
def build_authentication():
    g = base_graph(
        "Statechart S1 — User Authentication\\n"
        "SRS §3.1.1 Create Account · §3.1.2 Login · Session Lifecycle",
        width_in=15, height_in=11, dpi=200,
    )
    start(g, "s1_start")
    state(g, "s1_landing", "Unauthenticated",
          ["entry / render Login page",
           "do / wait for user action"],
          fill="#ECEFF1", border="#455A64")
    state(g, "s1_registering", "Registering",
          ["entry / render RegisterPage",
           "do / collect firstName, lastName, email, password"],
          fill="#FFF3E0", border="#E65100")
    state(g, "s1_valReg", "Validating Registration",
          ["do / POST /api/auth/register",
           "  @Valid RegisterRequest",
           "  BCrypt-hash password",
           "  check email uniqueness"],
          fill="#FFFDE7", border="#F9A825")
    state(g, "s1_login", "Entering Credentials",
          ["entry / render LoginPage",
           "do / collect email + password"],
          fill="#FFF3E0", border="#E65100")
    state(g, "s1_valLogin", "Validating Credentials",
          ["do / POST /api/auth/login",
           "  lookup user by email",
           "  BCrypt.matches(password, hash)",
           "  generate JWT (HS256)"],
          fill="#FFFDE7", border="#F9A825")
    state(g, "s1_session", "Session Active",
          ["entry / store JWT + user in AuthContext",
           "do / every request attaches Bearer &lt;token&gt;",
           "     JwtAuthFilter validates on each call"],
          fill="#E8F5E9", border="#2E7D32")
    state(g, "s1_expired", "Token Expired",
          ["entry / axios 401 interceptor fires",
           "do / clear AuthContext, redirect to /login"],
          fill="#FFEBEE", border="#C62828")
    end(g, "s1_end")

    # Transitions
    t(g, "s1_start",       "s1_landing")
    t(g, "s1_landing",     "s1_registering", trigger="click Register")
    t(g, "s1_landing",     "s1_login",       trigger="click Login")
    t(g, "s1_registering", "s1_valReg",      trigger="submit form",
      action="POST /api/auth/register")
    t(g, "s1_valReg",      "s1_registering", trigger="400 Bad Request",
      guard="email taken or validation fail",
      action="show error", color="#C62828", style="dashed")
    t(g, "s1_valReg",      "s1_session",     trigger="201 Created",
      action="save JWT + user",
      color="#2E7D32")
    t(g, "s1_login",       "s1_valLogin",    trigger="submit form",
      action="POST /api/auth/login")
    t(g, "s1_valLogin",    "s1_login",       trigger="401 Unauthorized",
      guard="wrong password",
      action="show error", color="#C62828", style="dashed")
    t(g, "s1_valLogin",    "s1_session",     trigger="200 OK",
      action="save JWT + user",
      color="#2E7D32")
    t(g, "s1_session",     "s1_session",     trigger="authenticated request")
    t(g, "s1_session",     "s1_expired",     trigger="JWT expired",
      guard="> 24h OR 15-min idle timeout",
      color="#C62828", style="dashed")
    t(g, "s1_expired",     "s1_login",       trigger="auto-redirect")
    t(g, "s1_session",     "s1_end",         trigger="click Logout",
      action="clear AuthContext", color="#455A64")

    return g


# =============================================================================
# S2 — EXPENSE / INCOME RECORD LIFECYCLE  (SRS §3.1.3 + §3.1.4)
# =============================================================================
def build_record_lifecycle():
    g = base_graph(
        "Statechart S2 — Income / Expense Record Lifecycle\\n"
        "SRS §3.1.3 Record Income · §3.1.4 Record Expense  (CRUD)",
        width_in=15, height_in=10, dpi=200,
    )
    start(g, "s2_start")
    state(g, "s2_none", "No Record",
          ["entry / render IncomePage / ExpensePage"],
          fill="#ECEFF1", border="#455A64")
    state(g, "s2_draft", "Draft",
          ["entry / render IncomeForm / ExpenseForm",
           "do / user fills amount, source/category,",
           "     date, description"],
          fill="#FFF3E0", border="#E65100")
    state(g, "s2_validating", "Validating",
          ["do / Bean Validation",
           "  @DecimalMin(\"0.01\") amount",
           "  @NotBlank source | category",
           "  @NotNull date",
           "  persist User reference"],
          fill="#FFFDE7", border="#F9A825")
    state(g, "s2_persisted", "Persisted",
          ["entry / INSERT into income / expenses",
           "do / display row in list",
           "     update DashboardSummaryDTO totals"],
          fill="#E8F5E9", border="#2E7D32")
    state(g, "s2_editing", "Editing",
          ["entry / populate form with row data",
           "do / allow field edits"],
          fill="#E3F2FD", border="#1565C0")
    state(g, "s2_updating", "Updating",
          ["do / PUT /api/income/{id} | /api/expense/{id}",
           "  @Valid dto",
           "  UPDATE row"],
          fill="#FFFDE7", border="#F9A825")
    state(g, "s2_deleting", "Confirm Delete",
          ["do / show confirmation dialog"],
          fill="#FFEBEE", border="#C62828")
    end(g, "s2_end")

    t(g, "s2_start",      "s2_none")
    t(g, "s2_none",       "s2_draft",      trigger="click Add")
    t(g, "s2_draft",      "s2_validating", trigger="submit")
    t(g, "s2_validating", "s2_draft",      trigger="400 Bad Request",
      guard="constraint violation", action="show field errors",
      color="#C62828", style="dashed")
    t(g, "s2_validating", "s2_persisted",  trigger="201 Created",
      action="append to list", color="#2E7D32")
    t(g, "s2_persisted",  "s2_editing",    trigger="click Edit")
    t(g, "s2_editing",    "s2_updating",   trigger="submit")
    t(g, "s2_updating",   "s2_editing",    trigger="400 Bad Request",
      color="#C62828", style="dashed")
    t(g, "s2_updating",   "s2_persisted",  trigger="200 OK",
      action="refresh row", color="#2E7D32")
    t(g, "s2_persisted",  "s2_deleting",   trigger="click Delete")
    t(g, "s2_deleting",   "s2_persisted",  trigger="cancel",
      color="#455A64", style="dashed")
    t(g, "s2_deleting",   "s2_end",        trigger="confirm",
      action="DELETE /api/income/{id} → 204 No Content",
      color="#C62828")
    t(g, "s2_persisted",  "s2_draft",      trigger="click Add another")

    return g


# =============================================================================
# S3 — TUITION PLANNING  (SRS §3.1.5)
# =============================================================================
def build_tuition_planning():
    g = base_graph(
        "Statechart S3 — Tuition Planning Calculation\\n"
        "SRS §3.1.5 Tuition Planning",
        width_in=14, height_in=10, dpi=200,
    )
    start(g, "s3_start")
    state(g, "s3_idle", "Idle",
          ["entry / navigate to TuitionPlannerPage"],
          fill="#ECEFF1", border="#455A64")
    state(g, "s3_input", "Entering Inputs",
          ["entry / render TuitionForm",
           "do / collect tuitionPerCourse,",
           "     numberOfCourses, scholarshipAmount"],
          fill="#FFF3E0", border="#E65100")
    state(g, "s3_valid", "Validating",
          ["do / Bean Validation",
           "  @DecimalMin(\"0.01\") tuitionPerCourse",
           "  @Min(1) numberOfCourses"],
          fill="#FFFDE7", border="#F9A825")
    state(g, "s3_calc", "Calculating",
          ["do / POST /api/tuition/calculate",
           "  grossTuition = per × number",
           "  netTuition = gross − scholarship",
           "  persist TuitionPlan"],
          fill="#E3F2FD", border="#1565C0")
    state(g, "s3_display", "Displaying Result",
          ["entry / render TuitionResultDTO",
           "  grossTuition, netTuition",
           "do / wait for user review"],
          fill="#E8F5E9", border="#2E7D32")
    state(g, "s3_adjust", "Adjusting Inputs",
          ["do / modify numberOfCourses / scholarshipAmount"],
          fill="#FFF3E0", border="#E65100")
    end(g, "s3_end")

    t(g, "s3_start",   "s3_idle")
    t(g, "s3_idle",    "s3_input",   trigger="visit page")
    t(g, "s3_input",   "s3_valid",   trigger="click Calculate")
    t(g, "s3_valid",   "s3_input",   trigger="400 Bad Request",
      guard="invalid numbers", color="#C62828", style="dashed")
    t(g, "s3_valid",   "s3_calc",    trigger="pass",
      action="TuitionService.calculate(email, req)",
      color="#2E7D32")
    t(g, "s3_calc",    "s3_display", trigger="200 OK",
      color="#2E7D32")
    t(g, "s3_calc",    "s3_input",   trigger="500 Error",
      color="#C62828", style="dashed")
    t(g, "s3_display", "s3_adjust",  trigger="click Recalculate")
    t(g, "s3_adjust",  "s3_valid",   trigger="click Calculate")
    t(g, "s3_display", "s3_end",     trigger="leave page",
      color="#455A64")

    return g


# =============================================================================
# S4 — WHAT-IF SIMULATION  (SRS §3.1.8)
# =============================================================================
def build_simulation():
    g = base_graph(
        "Statechart S4 — What-If Simulation\\n"
        "SRS §3.1.8 What-If Simulation",
        width_in=15, height_in=12, dpi=200,
    )
    start(g, "s4_start")
    state(g, "s4_idle", "Idle",
          ["entry / navigate to SimulationPage"],
          fill="#ECEFF1", border="#455A64")
    state(g, "s4_baseline", "Loading Baseline",
          ["entry / GET /api/dashboard/summary",
           "do / fetch user's actual income + expense history",
           "  populate current trajectory"],
          fill="#E3F2FD", border="#1565C0")
    state(g, "s4_config", "Configuring Scenario",
          ["entry / render SimulationForm",
           "do / collect hypotheticalMonthlyIncome,",
           "     hypotheticalMonthlyExpenses, months"],
          fill="#FFF3E0", border="#E65100")
    state(g, "s4_valid", "Validating",
          ["do / Bean Validation",
           "  @DecimalMin income, expenses",
           "  @Min(1) @Max(60) months"],
          fill="#FFFDE7", border="#F9A825")
    state(g, "s4_sim", "Simulating",
          ["do / POST /api/simulation/run",
           "  for m = 1..months:",
           "    balance += income − expenses",
           "    monthlyBalances[m] = balance",
           "  projectedFinalBalance",
           "  projectedTotalSavings"],
          fill="#E3F2FD", border="#1565C0")
    state(g, "s4_show", "Displaying Projection",
          ["entry / render SimulationResultDTO",
           "  monthlyBalances chart",
           "  final + total savings"],
          fill="#E8F5E9", border="#2E7D32")
    state(g, "s4_compare", "Comparing Scenarios",
          ["do / add another scenario to chart",
           "  label each run"],
          fill="#F3E5F5", border="#6A1B9A")
    end(g, "s4_end")

    t(g, "s4_start",    "s4_idle")
    t(g, "s4_idle",     "s4_baseline", trigger="visit page")
    t(g, "s4_baseline", "s4_config",   trigger="history loaded",
      color="#2E7D32")
    t(g, "s4_baseline", "s4_idle",     trigger="fetch error",
      color="#C62828", style="dashed")
    t(g, "s4_config",   "s4_valid",    trigger="click Run")
    t(g, "s4_valid",    "s4_config",   trigger="400 Bad Request",
      color="#C62828", style="dashed")
    t(g, "s4_valid",    "s4_sim",      trigger="pass",
      action="WhatIfSimulationService.runSimulation()",
      color="#2E7D32")
    t(g, "s4_sim",      "s4_show",     trigger="200 OK",
      color="#2E7D32")
    t(g, "s4_sim",      "s4_config",   trigger="500 Error",
      color="#C62828", style="dashed")
    t(g, "s4_show",     "s4_config",   trigger="new scenario")
    t(g, "s4_show",     "s4_compare",  trigger="add scenario")
    t(g, "s4_compare",  "s4_config",   trigger="new scenario")
    t(g, "s4_show",     "s4_end",      trigger="leave page",
      color="#455A64")

    return g


# =============================================================================
# S5 — AI ADVISOR SESSION  (SRS §3.1.7)
# =============================================================================
def build_ai_advisor():
    g = base_graph(
        "Statechart S5 — AI Financial Advisor Session\\n"
        "SRS §3.1.7 AI Financial Advisor",
        width_in=16, height_in=11, dpi=200,
    )
    start(g, "s5_start")
    state(g, "s5_idle", "Idle",
          ["entry / navigate to AIAdvisorPage"],
          fill="#ECEFF1", border="#455A64")
    state(g, "s5_compose", "Composing Question",
          ["entry / focus AIChat textarea",
           "do / user types question"],
          fill="#FFF3E0", border="#E65100")
    state(g, "s5_sending", "Sending Request",
          ["do / POST /api/ai/ask",
           "  @Valid AIQueryDTO { question }"],
          fill="#FFFDE7", border="#F9A825")
    state(g, "s5_context", "Loading Context",
          ["do / AIAdvisorService.ask(email, query)",
           "  fetch DashboardSummaryDTO",
           "  fetch recent expenses + income"],
          fill="#E3F2FD", border="#1565C0")
    state(g, "s5_prompt", "Building Prompt",
          ["do / assemble system prompt",
           "  {totals, recent items,",
           "   user question}"],
          fill="#E3F2FD", border="#1565C0")
    state(g, "s5_await", "Awaiting OpenAI",
          ["do / POST api.openai.com/v1/chat/completions",
           "  Authorization: Bearer ${openai.api.key}",
           "  model: gpt-4o-mini",
           "  (≤ 5 s SLA per NFR)"],
          fill="#F3E5F5", border="#6A1B9A")
    state(g, "s5_stream", "Streaming Response",
          ["do / read completion chunks",
           "  append to AIChat message"],
          fill="#F3E5F5", border="#6A1B9A")
    state(g, "s5_shown", "Response Displayed",
          ["entry / render AIResponseDTO",
           "  answer, model, generatedAt"],
          fill="#E8F5E9", border="#2E7D32")
    state(g, "s5_error", "Error",
          ["entry / show error banner",
           "do / log + offer retry"],
          fill="#FFEBEE", border="#C62828")
    end(g, "s5_end")

    t(g, "s5_start",   "s5_idle")
    t(g, "s5_idle",    "s5_compose", trigger="open chat")
    t(g, "s5_compose", "s5_sending", trigger="click Send")
    t(g, "s5_sending", "s5_context", trigger="201 Accepted",
      color="#2E7D32")
    t(g, "s5_sending", "s5_error",   trigger="400 Bad Request",
      guard="empty question", color="#C62828", style="dashed")
    t(g, "s5_context", "s5_prompt",  trigger="context loaded")
    t(g, "s5_prompt",  "s5_await",   trigger="HTTP call dispatched")
    t(g, "s5_await",   "s5_stream",  trigger="200 OK", color="#2E7D32")
    t(g, "s5_await",   "s5_error",   trigger="timeout / 5xx",
      guard="elapsed > 5 s", color="#C62828", style="dashed")
    t(g, "s5_stream",  "s5_shown",   trigger="stream complete",
      color="#2E7D32")
    t(g, "s5_shown",   "s5_compose", trigger="follow-up question")
    t(g, "s5_error",   "s5_compose", trigger="click Retry")
    t(g, "s5_shown",   "s5_end",     trigger="close chat",
      color="#455A64")

    return g


# =============================================================================
# Render
# =============================================================================
if __name__ == "__main__":
    charts = [
        ("Authentication",        build_authentication),
        ("ExpenseIncomeLifecycle", build_record_lifecycle),
        ("TuitionPlanning",       build_tuition_planning),
        ("WhatIfSimulation",      build_simulation),
        ("AIAdvisorSession",      build_ai_advisor),
    ]
    for fmt in ("png", "svg"):
        for fname, builder in charts:
            g = builder()
            g.format = fmt
            g.render(filename=f"Statechart_{fname}",
                     directory=str(OUT_DIR),
                     cleanup=False)
    print("Done.")
