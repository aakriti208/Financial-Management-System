from pathlib import Path
from graphviz import Digraph

OUT_DIR = Path("/sessions/zealous-nice-faraday/mnt/Financial-Management-System/docs/diagrams")
OUT_DIR.mkdir(parents=True, exist_ok=True)


def cls(name, package, attrs=None, methods=None, iface=False, external=False):
    """IDE-style class box.

    * iface=True      \u2192 \u00abJava Interface\u00bb header, lighter yellow
    * external=True   \u2192 \u00abexternal\u00bb header, pale-blue fill (e.g. OpenAI API)
    """
    if external:
        stereo = "external"
        fill = "#E3F2FD"
        stereo_bg = "#90CAF9"
    elif iface:
        stereo = "Java Interface"
        fill = "#FFFDE7"
        stereo_bg = "#FFE082"
    else:
        stereo = "Java Class"
        fill = "#FFFDE7"
        stereo_bg = "#FFF59D"

    parts = [
        f'<TABLE BORDER="1" CELLBORDER="0" CELLSPACING="0" CELLPADDING="3" BGCOLOR="{fill}">'
    ]
    parts.append(
        f'<TR><TD BGCOLOR="{stereo_bg}" ALIGN="CENTER">'
        f'<FONT POINT-SIZE="10"><I>&#171;{stereo}&#187;</I></FONT></TD></TR>'
    )
    parts.append(
        f'<TR><TD BGCOLOR="{fill}" ALIGN="CENTER"><B>{name}</B></TD></TR>'
    )
    if package:
        parts.append(
            f'<TR><TD BGCOLOR="{fill}" ALIGN="CENTER">'
            f'<FONT POINT-SIZE="9" COLOR="#666666">{package}</FONT></TD></TR>'
        )
    parts.append('<HR/>')
    for a in (attrs or [" "]):
        parts.append(f'<TR><TD ALIGN="LEFT"><FONT POINT-SIZE="10">{a}</FONT></TD></TR>')
    parts.append('<HR/>')
    for m in (methods or [" "]):
        parts.append(f'<TR><TD ALIGN="LEFT"><FONT POINT-SIZE="10">{m}</FONT></TD></TR>')
    parts.append('</TABLE>')
    return "<" + "".join(parts) + ">"


# =============================================================================
# Edge shorthand
# =============================================================================
def edge(g, a, b, label, style="solid", color="#444444", arrowhead="vee"):
    g.edge(a, b, label=label, style=style, color=color,
           fontcolor=color, fontsize="10", arrowhead=arrowhead)


# =============================================================================
# Base graph
# =============================================================================
def base_graph(title, dpi=180):
    g = Digraph(format="png")
    g.attr(rankdir="TB",
           splines="spline",
           nodesep="0.55",
           ranksep="0.9",
           fontname="Helvetica",
           fontsize="14",
           labelloc="t",
           label=title,
           dpi=str(dpi))
    g.attr("node", shape="plaintext", fontname="Helvetica")
    g.attr("edge", fontname="Helvetica")
    return g


def nested_packages(g, leaf_label, body_fn):
    """Wrap body_fn inside com \u2192 fms \u2192 <leaf_label> folder-tab clusters."""
    with g.subgraph(name="cluster_com") as c:
        c.attr(label="com", style="rounded", color="#333333",
               fontname="Helvetica-Bold", fontsize="12",
               labeljust="l", labelloc="t", penwidth="1.2")
        with c.subgraph(name="cluster_fms") as f:
            f.attr(label="fms", style="rounded", color="#333333",
                   fontname="Helvetica-Bold", fontsize="12",
                   labeljust="l", labelloc="t", penwidth="1.2")
            with f.subgraph(name=f"cluster_{leaf_label}") as leaf:
                leaf.attr(label=leaf_label, style="rounded", color="#333333",
                          fontname="Helvetica-Bold", fontsize="12",
                          labeljust="l", labelloc="t", penwidth="1.2")
                body_fn(leaf)


# =============================================================================
# 1. AUTH
# =============================================================================
def build_auth():
    g = base_graph("FMS \u2014 Authentication (class diagram)")

    def body(pkg):
        pkg.node("ctrl", cls(
            "AuthController", "controller",
            ["- authService: AuthService"],
            ["+ register(req: RegisterRequest): ResponseEntity&lt;AuthResponse&gt;",
             "+ login(req: LoginRequest): ResponseEntity&lt;AuthResponse&gt;"]
        ))
        pkg.node("svc_if", cls(
            "AuthService", "service",
            [" "],
            ["+ register(req: RegisterRequest): AuthResponse",
             "+ login(req: LoginRequest): AuthResponse"],
            iface=True))
        pkg.node("svc_impl", cls(
            "AuthServiceImpl", "service",
            ["- userRepository: UserRepository",
             "- passwordEncoder: PasswordEncoder",
             "- jwtUtil: JwtUtil"],
            ["+ register(req: RegisterRequest): AuthResponse",
             "+ login(req: LoginRequest): AuthResponse"]))
        pkg.node("repo", cls(
            "UserRepository", "repository",
            [" "],
            ["+ findByEmail(email: String): Optional&lt;User&gt;",
             "+ existsByEmail(email: String): boolean"],
            iface=True))
        pkg.node("user", cls(
            "User", "model",
            ["- id: Long",
             "- firstName: String",
             "- lastName: String",
             "- email: String",
             "- passwordHash: String",
             "- createdAt: LocalDateTime"],
            [" "]))
        pkg.node("dto_reg", cls("RegisterRequest", "dto",
            ["- firstName: String",
             "- lastName: String",
             "- email: String",
             "- password: String"], [" "]))
        pkg.node("dto_log", cls("LoginRequest", "dto",
            ["- email: String",
             "- password: String"], [" "]))
        pkg.node("dto_res", cls("AuthResponse", "dto",
            ["- token: String",
             "- email: String",
             "- firstName: String",
             "- lastName: String"], [" "]))
        pkg.node("jwt", cls(
            "JwtUtil", "config",
            ["- jwtSecret: String",
             "- jwtExpirationMs: long"],
            ["+ generateToken(email: String): String",
             "+ validateToken(token: String): boolean",
             "+ extractEmail(token: String): String"]))

    nested_packages(g, "auth", body)

    edge(g, "ctrl", "svc_if", "uses")
    edge(g, "svc_impl", "svc_if", "implements", style="dashed", arrowhead="empty")
    edge(g, "svc_impl", "repo", "uses")
    edge(g, "svc_impl", "jwt", "signs with")
    edge(g, "repo", "user", "manages")
    edge(g, "ctrl", "dto_reg", "receives", style="dashed")
    edge(g, "ctrl", "dto_log", "receives", style="dashed")
    edge(g, "ctrl", "dto_res", "returns", style="dashed")
    edge(g, "svc_impl", "user", "creates")

    path = OUT_DIR / "ClassDiagram_Auth"
    g.render(str(path), format="png", cleanup=False)
    g.format = "svg"
    g.render(str(path), format="svg", cleanup=False)
    return path


# =============================================================================
# 2. INCOME
# =============================================================================
def build_income():
    g = base_graph("FMS \u2014 Income Management (class diagram)")

    def body(pkg):
        pkg.node("ctrl", cls(
            "IncomeController", "controller",
            ["- incomeService: IncomeService"],
            ["+ getAll(email: String): ResponseEntity&lt;List&lt;IncomeDTO&gt;&gt;",
             "+ add(email: String, dto: IncomeDTO): ResponseEntity&lt;IncomeDTO&gt;",
             "+ update(id: Long, dto: IncomeDTO): ResponseEntity&lt;IncomeDTO&gt;",
             "+ delete(id: Long): ResponseEntity&lt;Void&gt;"]))
        pkg.node("svc_if", cls(
            "IncomeService", "service",
            [" "],
            ["+ getAllByUser(email: String): List&lt;IncomeDTO&gt;",
             "+ add(email: String, dto: IncomeDTO): IncomeDTO",
             "+ update(id: Long, dto: IncomeDTO): IncomeDTO",
             "+ delete(id: Long): void"],
            iface=True))
        pkg.node("svc_impl", cls(
            "IncomeServiceImpl", "service",
            ["- incomeRepository: IncomeRepository",
             "- userRepository: UserRepository"],
            ["+ getAllByUser(email: String): List&lt;IncomeDTO&gt;",
             "+ add(email: String, dto: IncomeDTO): IncomeDTO",
             "+ update(id: Long, dto: IncomeDTO): IncomeDTO",
             "+ delete(id: Long): void",
             "- toDTO(income: Income): IncomeDTO"]))
        pkg.node("repo", cls(
            "IncomeRepository", "repository",
            [" "],
            ["+ findByUserOrderByDateDesc(user: User): List&lt;Income&gt;",
             "+ findByUserAndDateBetween(user: User, s: LocalDate, e: LocalDate): List&lt;Income&gt;"],
            iface=True))
        pkg.node("ent", cls(
            "Income", "model",
            ["- id: Long",
             "- user: User",
             "- amount: BigDecimal",
             "- source: String",
             "- sourceType: IncomeSourceType",
             "- date: LocalDate",
             "- description: String"], [" "]))
        pkg.node("enum", cls(
            "IncomeSourceType", "model",
            ["SCHOLARSHIP",
             "PART_TIME_JOB",
             "FAMILY_SUPPORT",
             "OTHER"], [" "]))
        pkg.node("dto", cls(
            "IncomeDTO", "dto",
            ["- id: Long",
             "- amount: BigDecimal  @DecimalMin(0.01)",
             "- source: String  @NotBlank",
             "- sourceType: IncomeSourceType",
             "- date: LocalDate",
             "- description: String"], [" "]))

    nested_packages(g, "income", body)

    edge(g, "ctrl", "svc_if", "uses")
    edge(g, "svc_impl", "svc_if", "implements", style="dashed", arrowhead="empty")
    edge(g, "svc_impl", "repo", "uses")
    edge(g, "repo", "ent", "persists")
    edge(g, "ent", "enum", "typed by", style="dashed")
    edge(g, "ctrl", "dto", "receives / returns", style="dashed")
    edge(g, "svc_impl", "ent", "creates")

    path = OUT_DIR / "ClassDiagram_Income"
    g.render(str(path), format="png", cleanup=False)
    g.format = "svg"
    g.render(str(path), format="svg", cleanup=False)
    return path


# =============================================================================
# 3. EXPENSE
# =============================================================================
def build_expense():
    g = base_graph("FMS \u2014 Expense Management (class diagram)")

    def body(pkg):
        pkg.node("ctrl", cls(
            "ExpenseController", "controller",
            ["- expenseService: ExpenseService"],
            ["+ getAll(email: String): ResponseEntity&lt;List&lt;ExpenseDTO&gt;&gt;",
             "+ add(email: String, dto: ExpenseDTO): ResponseEntity&lt;ExpenseDTO&gt;",
             "+ update(id: Long, dto: ExpenseDTO): ResponseEntity&lt;ExpenseDTO&gt;",
             "+ delete(id: Long): ResponseEntity&lt;Void&gt;"]))
        pkg.node("svc_if", cls(
            "ExpenseService", "service",
            [" "],
            ["+ getAllByUser(email: String): List&lt;ExpenseDTO&gt;",
             "+ add(email: String, dto: ExpenseDTO): ExpenseDTO",
             "+ update(id: Long, dto: ExpenseDTO): ExpenseDTO",
             "+ delete(id: Long): void"],
            iface=True))
        pkg.node("svc_impl", cls(
            "ExpenseServiceImpl", "service",
            ["- expenseRepository: ExpenseRepository",
             "- userRepository: UserRepository"],
            ["+ getAllByUser(email: String): List&lt;ExpenseDTO&gt;",
             "+ add(email: String, dto: ExpenseDTO): ExpenseDTO",
             "+ update(id: Long, dto: ExpenseDTO): ExpenseDTO",
             "+ delete(id: Long): void",
             "- toDTO(expense: Expense): ExpenseDTO"]))
        pkg.node("repo", cls(
            "ExpenseRepository", "repository",
            [" "],
            ["+ findByUserOrderByDateDesc(user: User): List&lt;Expense&gt;",
             "+ findByUserAndDateBetween(user: User, s: LocalDate, e: LocalDate): List&lt;Expense&gt;"],
            iface=True))
        pkg.node("ent", cls(
            "Expense", "model",
            ["- id: Long",
             "- user: User",
             "- amount: BigDecimal",
             "- category: String",
             "- expenseType: ExpenseType",
             "- necessity: Necessity",
             "- date: LocalDate",
             "- description: String"], [" "]))
        pkg.node("enum_type", cls(
            "ExpenseType", "model",
            ["ONE_TIME",
             "RECURRING"], [" "]))
        pkg.node("enum_nec", cls(
            "Necessity", "model",
            ["NEED",
             "WANT"], [" "]))
        pkg.node("dto", cls(
            "ExpenseDTO", "dto",
            ["- id: Long",
             "- amount: BigDecimal  @DecimalMin(0.01)",
             "- category: String  @NotBlank",
             "- expenseType: ExpenseType",
             "- necessity: Necessity",
             "- date: LocalDate",
             "- description: String"], [" "]))

    nested_packages(g, "expense", body)

    edge(g, "ctrl", "svc_if", "uses")
    edge(g, "svc_impl", "svc_if", "implements", style="dashed", arrowhead="empty")
    edge(g, "svc_impl", "repo", "uses")
    edge(g, "repo", "ent", "persists")
    edge(g, "ent", "enum_type", "typed by", style="dashed")
    edge(g, "ent", "enum_nec", "typed by", style="dashed")
    edge(g, "ctrl", "dto", "receives / returns", style="dashed")
    edge(g, "svc_impl", "ent", "creates")

    path = OUT_DIR / "ClassDiagram_Expense"
    g.render(str(path), format="png", cleanup=False)
    g.format = "svg"
    g.render(str(path), format="svg", cleanup=False)
    return path


# =============================================================================
# 4. TUITION
# =============================================================================
def build_tuition():
    g = base_graph("FMS \u2014 Tuition Planning (class diagram)")

    def body(pkg):
        pkg.node("ctrl", cls(
            "TuitionController", "controller",
            ["- tuitionService: TuitionService"],
            ["+ calculate(userDetails: UserDetails, req: TuitionRequestDTO): ResponseEntity&lt;TuitionResultDTO&gt;"]))
        pkg.node("svc_if", cls(
            "TuitionService", "service",
            [" "],
            ["+ calculate(email: String, req: TuitionRequestDTO): TuitionResultDTO"],
            iface=True))
        pkg.node("svc_impl", cls(
            "TuitionServiceImpl", "service",
            ["- tuitionPlanRepository: TuitionPlanRepository",
             "- userRepository: UserRepository"],
            ["+ calculate(email: String, req: TuitionRequestDTO): TuitionResultDTO",
             "// grossTuition = perCourse \u00d7 numberOfCourses",
             "// netTuition   = max(0, gross \u2212 scholarship)"]))
        pkg.node("repo", cls(
            "TuitionPlanRepository", "repository",
            [" "],
            ["+ findByUser(user: User): List&lt;TuitionPlan&gt;",
             "+ findByUserOrderByCreatedAtDesc(user: User): List&lt;TuitionPlan&gt;"],
            iface=True))
        pkg.node("ent", cls(
            "TuitionPlan", "model",
            ["- id: Long",
             "- user: User",
             "- tuitionPerCourse: BigDecimal",
             "- numberOfCourses: Integer",
             "- scholarshipAmount: BigDecimal",
             "- createdAt: LocalDateTime"], [" "]))
        pkg.node("dto_req", cls(
            "TuitionRequestDTO", "dto",
            ["- tuitionPerCourse: BigDecimal  @DecimalMin(0.01)",
             "- numberOfCourses: Integer  @Min(1)",
             "- scholarshipAmount: BigDecimal"], [" "]))
        pkg.node("dto_res", cls(
            "TuitionResultDTO", "dto",
            ["- tuitionPerCourse: BigDecimal",
             "- numberOfCourses: Integer",
             "- scholarshipAmount: BigDecimal",
             "- grossTuition: BigDecimal",
             "- netTuition: BigDecimal"], [" "]))

    nested_packages(g, "tuition", body)

    edge(g, "ctrl", "svc_if", "uses")
    edge(g, "svc_impl", "svc_if", "implements", style="dashed", arrowhead="empty")
    edge(g, "svc_impl", "repo", "uses")
    edge(g, "repo", "ent", "persists")
    edge(g, "ctrl", "dto_req", "receives", style="dashed")
    edge(g, "ctrl", "dto_res", "returns", style="dashed")
    edge(g, "svc_impl", "ent", "creates")

    path = OUT_DIR / "ClassDiagram_Tuition"
    g.render(str(path), format="png", cleanup=False)
    g.format = "svg"
    g.render(str(path), format="svg", cleanup=False)
    return path


# =============================================================================
# 5. SIMULATION
# =============================================================================
def build_simulation():
    g = base_graph("FMS \u2014 What-If Simulation (class diagram)")

    def body(pkg):
        pkg.node("ctrl", cls(
            "SimulationController", "controller",
            ["- simulationService: WhatIfSimulationService"],
            ["+ runSimulation(userDetails: UserDetails, req: SimulationRequestDTO): ResponseEntity&lt;SimulationResultDTO&gt;"]))
        pkg.node("svc_if", cls(
            "WhatIfSimulationService", "service",
            [" "],
            ["+ runSimulation(email: String, req: SimulationRequestDTO): SimulationResultDTO"],
            iface=True))
        pkg.node("svc_impl", cls(
            "WhatIfSimulationServiceImpl", "service",
            ["- userRepository: UserRepository",
             "- incomeRepository: IncomeRepository",
             "- expenseRepository: ExpenseRepository"],
            ["+ runSimulation(email: String, req: SimulationRequestDTO): SimulationResultDTO",
             "// balance += monthlyIncome \u2212 monthlyExpenses  (loop over projectionMonths)"]))
        pkg.node("repo_u", cls(
            "UserRepository", "repository",
            [" "],
            ["+ findByEmail(email: String): Optional&lt;User&gt;"],
            iface=True))
        pkg.node("repo_i", cls(
            "IncomeRepository", "repository",
            [" "],
            ["+ findByUser(user: User): List&lt;Income&gt;"],
            iface=True))
        pkg.node("repo_e", cls(
            "ExpenseRepository", "repository",
            [" "],
            ["+ findByUser(user: User): List&lt;Expense&gt;"],
            iface=True))
        pkg.node("dto_req", cls(
            "SimulationRequestDTO", "dto",
            ["- hypotheticalMonthlyIncome: BigDecimal  @NotNull",
             "- hypotheticalMonthlyExpenses: BigDecimal  @NotNull",
             "- projectionMonths: Integer  @Min(1) @Max(120)"], [" "]))
        pkg.node("dto_res", cls(
            "SimulationResultDTO", "dto",
            ["- projectedFinalBalance: BigDecimal",
             "- projectedTotalSavings: BigDecimal",
             "- monthlyBalances: List&lt;BigDecimal&gt;"], [" "]))

    nested_packages(g, "simulation", body)

    edge(g, "ctrl", "svc_if", "uses")
    edge(g, "svc_impl", "svc_if", "implements", style="dashed", arrowhead="empty")
    edge(g, "svc_impl", "repo_u", "reads baseline")
    edge(g, "svc_impl", "repo_i", "reads history")
    edge(g, "svc_impl", "repo_e", "reads history")
    edge(g, "ctrl", "dto_req", "receives", style="dashed")
    edge(g, "ctrl", "dto_res", "returns", style="dashed")

    path = OUT_DIR / "ClassDiagram_Simulation"
    g.render(str(path), format="png", cleanup=False)
    g.format = "svg"
    g.render(str(path), format="svg", cleanup=False)
    return path


# =============================================================================
# 6. PREDICTION
# =============================================================================
def build_prediction():
    g = base_graph("FMS \u2014 Expense Prediction (class diagram)")

    def body(pkg):
        pkg.node("ctrl", cls(
            "PredictionController", "controller",
            ["- predictionService: ExpensePredictionService"],
            ["+ predictExpenses(userDetails: UserDetails): ResponseEntity&lt;List&lt;ExpenseDTO&gt;&gt;"]))
        pkg.node("svc_if", cls(
            "ExpensePredictionService", "service",
            [" "],
            ["+ predictNextMonthExpenses(email: String): List&lt;ExpenseDTO&gt;"],
            iface=True))
        pkg.node("svc_impl", cls(
            "ExpensePredictionServiceImpl", "service",
            ["- expenseRepository: ExpenseRepository",
             "- userRepository: UserRepository"],
            ["+ predictNextMonthExpenses(email: String): List&lt;ExpenseDTO&gt;",
             "// 3-month moving average, grouped by category"]))
        pkg.node("repo", cls(
            "ExpenseRepository", "repository",
            [" "],
            ["+ findByUserAndDateBetween(u: User, s: LocalDate, e: LocalDate): List&lt;Expense&gt;"],
            iface=True))
        pkg.node("ent", cls(
            "Expense", "model",
            ["- amount: BigDecimal",
             "- category: String",
             "- date: LocalDate"], [" "]))
        pkg.node("dto", cls(
            "ExpenseDTO", "dto",
            ["- amount: BigDecimal",
             "- category: String",
             "- date: LocalDate",
             "- description: String"], [" "]))

    nested_packages(g, "prediction", body)

    edge(g, "ctrl", "svc_if", "uses")
    edge(g, "svc_impl", "svc_if", "implements", style="dashed", arrowhead="empty")
    edge(g, "svc_impl", "repo", "uses")
    edge(g, "repo", "ent", "persists")
    edge(g, "ctrl", "dto", "returns", style="dashed")
    edge(g, "svc_impl", "dto", "creates")

    path = OUT_DIR / "ClassDiagram_Prediction"
    g.render(str(path), format="png", cleanup=False)
    g.format = "svg"
    g.render(str(path), format="svg", cleanup=False)
    return path


# =============================================================================
# 7. DASHBOARD
# =============================================================================
def build_dashboard():
    g = base_graph("FMS \u2014 Dashboard (class diagram)")

    def body(pkg):
        pkg.node("ctrl", cls(
            "DashboardController", "controller",
            ["- dashboardService: DashboardService"],
            ["+ getSummary(email: String): ResponseEntity&lt;DashboardSummaryDTO&gt;"]))
        pkg.node("svc_if", cls(
            "DashboardService", "service",
            [" "],
            ["+ getSummary(email: String): DashboardSummaryDTO"],
            iface=True))
        pkg.node("svc_impl", cls(
            "DashboardServiceImpl", "service",
            ["- userRepository: UserRepository",
             "- incomeRepository: IncomeRepository",
             "- expenseRepository: ExpenseRepository"],
            ["+ getSummary(email: String): DashboardSummaryDTO",
             "- buildMonthlyData(user: User): List&lt;MonthlyDataDTO&gt;",
             "// 6-month bucketing + recent-5 + lifetime totals"]))
        pkg.node("repo_u", cls("UserRepository", "repository",
            [" "], ["+ findByEmail(email: String): Optional&lt;User&gt;"], iface=True))
        pkg.node("repo_i", cls("IncomeRepository", "repository",
            [" "], ["+ findByUserOrderByDateDesc(user: User): List&lt;Income&gt;",
                    "+ findByUserAndDateBetween(...): List&lt;Income&gt;"], iface=True))
        pkg.node("repo_e", cls("ExpenseRepository", "repository",
            [" "], ["+ findByUserOrderByDateDesc(user: User): List&lt;Expense&gt;",
                    "+ findByUserAndDateBetween(...): List&lt;Expense&gt;"], iface=True))
        pkg.node("dto_sum", cls(
            "DashboardSummaryDTO", "dto",
            ["- totalIncome: BigDecimal",
             "- totalExpenses: BigDecimal",
             "- netBalance: BigDecimal",
             "- recentIncome: List&lt;IncomeDTO&gt;",
             "- recentExpenses: List&lt;ExpenseDTO&gt;",
             "- monthlyData: List&lt;MonthlyDataDTO&gt;"], [" "]))
        pkg.node("dto_month", cls(
            "MonthlyDataDTO", "dto",
            ["- month: String",
             "- income: BigDecimal",
             "- expenses: BigDecimal"], [" "]))
        pkg.node("dto_inc", cls(
            "IncomeDTO", "dto",
            ["- id: Long",
             "- amount: BigDecimal",
             "- source: String",
             "- date: LocalDate"], [" "]))
        pkg.node("dto_exp", cls(
            "ExpenseDTO", "dto",
            ["- id: Long",
             "- amount: BigDecimal",
             "- category: String",
             "- date: LocalDate"], [" "]))

    nested_packages(g, "dashboard", body)

    edge(g, "ctrl", "svc_if", "uses")
    edge(g, "svc_impl", "svc_if", "implements", style="dashed", arrowhead="empty")
    edge(g, "svc_impl", "repo_u", "uses")
    edge(g, "svc_impl", "repo_i", "uses")
    edge(g, "svc_impl", "repo_e", "uses")
    edge(g, "ctrl", "dto_sum", "returns", style="dashed")
    edge(g, "dto_sum", "dto_month", "contains 1..*", arrowhead="odiamond")
    edge(g, "dto_sum", "dto_inc", "contains 1..*", arrowhead="odiamond")
    edge(g, "dto_sum", "dto_exp", "contains 1..*", arrowhead="odiamond")
    edge(g, "svc_impl", "dto_sum", "builds")

    path = OUT_DIR / "ClassDiagram_Dashboard"
    g.render(str(path), format="png", cleanup=False)
    g.format = "svg"
    g.render(str(path), format="svg", cleanup=False)
    return path


# =============================================================================
# 8. AI ADVISOR
# =============================================================================
def build_ai_advisor():
    g = base_graph("FMS \u2014 AI Advisor (class diagram)")

    def body(pkg):
        pkg.node("ctrl", cls(
            "AIAdvisorController", "controller",
            ["- aiAdvisorService: AIAdvisorService"],
            ["+ ask(userDetails: UserDetails, query: AIQueryDTO): ResponseEntity&lt;AIResponseDTO&gt;"]))
        pkg.node("svc_if", cls(
            "AIAdvisorService", "service",
            [" "],
            ["+ ask(email: String, query: AIQueryDTO): AIResponseDTO"],
            iface=True))
        pkg.node("svc_impl", cls(
            "AIAdvisorServiceImpl", "service",
            ["- openAiApiKey: String  @Value",
             "- dashboardService: DashboardService"],
            ["+ ask(email: String, query: AIQueryDTO): AIResponseDTO",
             "- buildSystemPrompt(summary: DashboardSummaryDTO): String"]))
        pkg.node("dash", cls(
            "DashboardService", "service",
            [" "],
            ["+ getSummary(email: String): DashboardSummaryDTO"],
            iface=True))
        pkg.node("dto_q", cls(
            "AIQueryDTO", "dto",
            ["- question: String  @NotBlank"], [" "]))
        pkg.node("dto_r", cls(
            "AIResponseDTO", "dto",
            ["- answer: String",
             "- model: String"], [" "]))

    nested_packages(g, "ai", body)

    # External OpenAI box, outside the com.fms package cluster
    g.node("openai", cls(
        "OpenAI Chat Completions",
        "api.openai.com/v1/chat/completions",
        ["POST /v1/chat/completions",
         "Authorization: Bearer ${openai.api.key}",
         "model: gpt-4o-mini",
         "temperature: 0.4"],
        ["+ chat(system: String, user: String): String"],
        external=True))

    edge(g, "ctrl", "svc_if", "uses")
    edge(g, "svc_impl", "svc_if", "implements", style="dashed", arrowhead="empty")
    edge(g, "svc_impl", "dash", "fetches context")
    edge(g, "svc_impl", "openai", "HTTPS POST", style="dotted", color="#1976D2")
    edge(g, "ctrl", "dto_q", "receives", style="dashed")
    edge(g, "ctrl", "dto_r", "returns", style="dashed")

    path = OUT_DIR / "ClassDiagram_AIAdvisor"
    g.render(str(path), format="png", cleanup=False)
    g.format = "svg"
    g.render(str(path), format="svg", cleanup=False)
    return path


# =============================================================================
# Driver
# =============================================================================
if __name__ == "__main__":
    builders = [
        ("Auth",       build_auth),
        ("Income",     build_income),
        ("Expense",    build_expense),
        ("Tuition",    build_tuition),
        ("Simulation", build_simulation),
        ("Prediction", build_prediction),
        ("Dashboard",  build_dashboard),
        ("AIAdvisor",  build_ai_advisor),
    ]
    for name, fn in builders:
        path = fn()
        print(f"  [ok] ClassDiagram_{name}  \u2192 {path}.png / .svg")
    print("\nAll 8 feature class diagrams rendered.")
