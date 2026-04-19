"""Render the FMS UML class diagrams to PNG using Graphviz DOT.

We produce THREE diagrams for readability:
  1. ClassDiagram_Backend.png   — Java/Spring Boot (entities, DTOs, repos, services, controllers, security)
  2. ClassDiagram_Frontend.png  — React/Vite (context, axios, services, pages, components)
  3. ClassDiagram.png           — Combined overview (simplified node contents)

All three share a common UML node renderer.
"""
from pathlib import Path
from graphviz import Digraph

OUT_DIR = Path("/sessions/zealous-nice-faraday/mnt/Financial-Management-System/docs/diagrams")
OUT_DIR.mkdir(parents=True, exist_ok=True)


# --- UML node builder ---------------------------------------------------------
def uml(name, stereotype, attrs, methods, fill="#FAFAFA", sterebg="#E3F2FD"):
    parts = [f'<TABLE BORDER="1" CELLBORDER="0" CELLSPACING="0" CELLPADDING="4" BGCOLOR="{fill}">']
    if stereotype:
        parts.append(f'<TR><TD BGCOLOR="{sterebg}" ALIGN="CENTER"><I>&#171;{stereotype}&#187;</I></TD></TR>')
    parts.append(f'<TR><TD BGCOLOR="{fill}" ALIGN="CENTER"><B>{name}</B></TD></TR>')
    parts.append('<HR/>')
    for a in (attrs or [" "]):
        parts.append(f'<TR><TD ALIGN="LEFT">{a}</TD></TR>')
    parts.append('<HR/>')
    for m in (methods or [" "]):
        parts.append(f'<TR><TD ALIGN="LEFT">{m}</TD></TR>')
    parts.append('</TABLE>')
    return "<" + "".join(parts) + ">"


def add_class(graph, node_id, name, stereotype="", attrs=None, methods=None,
              fill="#FAFAFA", sterebg="#E3F2FD"):
    graph.node(node_id, uml(name, stereotype, attrs or [], methods or [], fill=fill, sterebg=sterebg))


def base_graph(title, width_in=20, height_in=28, dpi=200):
    g = Digraph(format="png")
    g.attr(rankdir="TB",
           splines="spline",
           nodesep="0.4",
           ranksep="0.8",
           fontname="Helvetica",
           fontsize="18",
           dpi=str(dpi),
           bgcolor="white",
           size=f"{width_in},{height_in}!",  # '!' forces exact size
           newrank="true",
           compound="true",
           label=title,
           labelloc="t",
           labeljust="c")
    g.attr("node", shape="plain", fontname="Helvetica", fontsize="12")
    g.attr("edge", fontname="Helvetica", fontsize="10", arrowsize="0.8", penwidth="1.1")
    return g


# =============================================================================
# DIAGRAM 1 — BACKEND
# =============================================================================
def build_backend():
    g = base_graph(
        "Financial Management System — Backend Class Diagram (Spring Boot)\\n"
        "CS 5394 Group 2 · Aakriti Dhakal · Agnes Jesionowska · Manoj Khanal",
        width_in=18, height_in=40, dpi=180,
    )
    # Chain nodes WITHIN each cluster vertically so they stack instead of
    # spreading left-to-right. This is the trick that forces dot to use
    # a taller layout.
    def stack(nodes, w=20, minlen=1):
        for a, b in zip(nodes, nodes[1:]):
            g.edge(a, b, style="invis", weight=str(w), minlen=str(minlen))

    # ----------------- MODEL -----------------
    with g.subgraph(name="cluster_model") as c:
        c.attr(label="com.fms.model  «Entity»", style="filled", fillcolor="#F4F8FC",
               color="#4A6FA5", fontname="Helvetica-Bold", fontsize="14")
        add_class(c, "User", "User", "@Entity",
            ["- id : Long", "- firstName : String", "- lastName : String",
             "- email : String  {unique}", "- passwordHash : String",
             "- createdAt : Instant"],
            ["+ getId() : Long", "+ getEmail() : String",
             "+ getFirstName() : String", "+ getLastName() : String"],
            fill="#E8F5E9", sterebg="#C8E6C9")
        add_class(c, "Income", "Income", "@Entity",
            ["- id : Long", "- amount : BigDecimal", "- source : String",
             "- date : LocalDate", "- description : String", "- user : User"],
            ["+ getAmount() : BigDecimal", "+ getSource() : String",
             "+ getDate() : LocalDate"],
            fill="#E8F5E9", sterebg="#C8E6C9")
        add_class(c, "Expense", "Expense", "@Entity",
            ["- id : Long", "- amount : BigDecimal", "- category : String",
             "- date : LocalDate", "- description : String", "- user : User"],
            ["+ getAmount() : BigDecimal", "+ getCategory() : String",
             "+ getDate() : LocalDate"],
            fill="#E8F5E9", sterebg="#C8E6C9")
        add_class(c, "TuitionPlan", "TuitionPlan", "@Entity",
            ["- id : Long", "- tuitionPerCourse : BigDecimal",
             "- numberOfCourses : Integer", "- scholarshipAmount : BigDecimal",
             "- createdAt : Instant", "- user : User"],
            ["+ getTotalTuition() : BigDecimal"],
            fill="#E8F5E9", sterebg="#C8E6C9")

    # ----------------- DTO -----------------
    with g.subgraph(name="cluster_dto") as c:
        c.attr(label="com.fms.dto  «DTO»", style="filled", fillcolor="#FFFDE7",
               color="#F9A825", fontname="Helvetica-Bold", fontsize="14")
        dtos = [
            ("RegisterRequest", ["+ firstName", "+ lastName", "+ email", "+ password"]),
            ("LoginRequest",    ["+ email", "+ password"]),
            ("AuthResponse",    ["+ token", "+ email", "+ firstName", "+ lastName"]),
            ("IncomeDTO",       ["+ id", "+ amount", "+ source", "+ date", "+ description"]),
            ("ExpenseDTO",      ["+ id", "+ amount", "+ category", "+ date", "+ description"]),
            ("DashboardSummaryDTO",
                 ["+ totalIncome", "+ totalExpenses", "+ netBalance",
                  "+ recentIncome : List", "+ recentExpenses : List",
                  "+ expenseByCategory : Map"]),
            ("TuitionRequestDTO",
                 ["+ tuitionPerCourse", "+ numberOfCourses",
                  "+ scholarshipAmount", "+ monthsUntilDue"]),
            ("TuitionResultDTO",
                 ["+ totalTuition", "+ netTuition", "+ projectedSavings",
                  "+ affordable : boolean", "+ message"]),
            ("PredictionResultDTO",
                 ["+ predictedNextMonth", "+ monthsUsed", "+ history"]),
            ("SimulationRequestDTO",
                 ["+ hypoIncome", "+ hypoExpenses", "+ projectionMonths"]),
            ("SimulationResultDTO",
                 ["+ hypoSurplus", "+ endingBalance", "+ timeline", "+ verdict"]),
            ("AIQueryDTO", ["+ question"]),
            ("AIResponseDTO", ["+ answer", "+ dataPointsUsed"]),
        ]
        for n, a in dtos:
            add_class(c, n, n, "DTO", a, [], fill="#FFF8E1", sterebg="#FFECB3")

    # ----------------- REPOSITORY -----------------
    with g.subgraph(name="cluster_repo") as c:
        c.attr(label="com.fms.repository  «JpaRepository»", style="filled",
               fillcolor="#FBEAFF", color="#6A1B9A",
               fontname="Helvetica-Bold", fontsize="14")
        add_class(c, "UserRepository", "UserRepository", "interface", [],
            ["+ findByEmail(email) : Optional&lt;User&gt;",
             "+ existsByEmail(email) : boolean"],
            fill="#F3E5F5", sterebg="#E1BEE7")
        add_class(c, "IncomeRepository", "IncomeRepository", "interface", [],
            ["+ findByUserOrderByDateDesc(u)",
             "+ findByUserAndDateBetween(u,f,t)"],
            fill="#F3E5F5", sterebg="#E1BEE7")
        add_class(c, "ExpenseRepository", "ExpenseRepository", "interface", [],
            ["+ findByUserOrderByDateDesc(u)",
             "+ findByUserAndDateBetween(u,f,t)",
             "+ sumByCategory(u) : List&lt;Object[]&gt;"],
            fill="#F3E5F5", sterebg="#E1BEE7")
        add_class(c, "TuitionPlanRepository", "TuitionPlanRepository", "interface", [],
            ["+ findByUserOrderByCreatedAtDesc(u)"],
            fill="#F3E5F5", sterebg="#E1BEE7")

    # ----------------- SERVICE -----------------
    with g.subgraph(name="cluster_svc") as c:
        c.attr(label="com.fms.service  (interface + impl)", style="filled",
               fillcolor="#E3F2FD", color="#1565C0",
               fontname="Helvetica-Bold", fontsize="14")
        services = [
            ("AuthService",            ["+ register(req) : AuthResponse",
                                        "+ login(req) : AuthResponse"]),
            ("IncomeService",          ["+ list() : List",
                                        "+ create(dto) : IncomeDTO",
                                        "+ update(id,dto)", "+ delete(id)"]),
            ("ExpenseService",         ["+ list()", "+ create(dto)",
                                        "+ update(id,dto)", "+ delete(id)"]),
            ("DashboardService",       ["+ getSummary() : DashboardSummaryDTO"]),
            ("TuitionService",         ["+ calculate(req) : TuitionResultDTO"]),
            ("ExpensePredictionService",["+ predictNextMonth() : PredictionResultDTO"]),
            ("WhatIfSimulationService",["+ runSimulation(req) : SimulationResultDTO"]),
            ("AIAdvisorService",       ["+ ask(q) : AIResponseDTO"]),
        ]
        for iface, methods in services:
            add_class(c, iface, iface, "interface", [], methods,
                      fill="#BBDEFB", sterebg="#90CAF9")
        for iface, _ in services:
            impl = iface + "Impl"
            add_class(c, impl, impl, "@Service", [], [],
                      fill="#E3F2FD", sterebg="#BBDEFB")

    # ----------------- CONTROLLER -----------------
    with g.subgraph(name="cluster_ctrl") as c:
        c.attr(label="com.fms.controller  «@RestController»", style="filled",
               fillcolor="#FFEBEE", color="#C62828",
               fontname="Helvetica-Bold", fontsize="14")
        add_class(c, "AuthController", "AuthController", "@RestController",
            ["- authService : AuthService"],
            ["+ POST /api/auth/register", "+ POST /api/auth/login"],
            fill="#FFCDD2", sterebg="#EF9A9A")
        add_class(c, "IncomeController", "IncomeController", "@RestController",
            ["- incomeService"],
            ["+ GET /api/income", "+ POST /api/income",
             "+ PUT /api/income/{id}", "+ DELETE /api/income/{id}"],
            fill="#FFCDD2", sterebg="#EF9A9A")
        add_class(c, "ExpenseController", "ExpenseController", "@RestController",
            ["- expenseService"],
            ["+ GET /api/expense", "+ POST /api/expense",
             "+ PUT /api/expense/{id}", "+ DELETE /api/expense/{id}"],
            fill="#FFCDD2", sterebg="#EF9A9A")
        add_class(c, "DashboardController", "DashboardController", "@RestController",
            ["- dashboardService"],
            ["+ GET /api/dashboard/summary"],
            fill="#FFCDD2", sterebg="#EF9A9A")
        add_class(c, "TuitionController", "TuitionController", "@RestController",
            ["- tuitionService"],
            ["+ POST /api/tuition/calculate"],
            fill="#FFCDD2", sterebg="#EF9A9A")
        add_class(c, "PredictionController", "PredictionController", "@RestController",
            ["- predictionService"],
            ["+ GET /api/prediction/expenses"],
            fill="#FFCDD2", sterebg="#EF9A9A")
        add_class(c, "SimulationController", "SimulationController", "@RestController",
            ["- simulationService"],
            ["+ POST /api/simulation/run"],
            fill="#FFCDD2", sterebg="#EF9A9A")
        add_class(c, "AIAdvisorController", "AIAdvisorController", "@RestController",
            ["- aiService"],
            ["+ POST /api/ai/ask"],
            fill="#FFCDD2", sterebg="#EF9A9A")

    # ----------------- CONFIG -----------------
    with g.subgraph(name="cluster_cfg") as c:
        c.attr(label="com.fms.config  «@Configuration»", style="filled",
               fillcolor="#FFF3E0", color="#E65100",
               fontname="Helvetica-Bold", fontsize="14")
        add_class(c, "SecurityConfig", "SecurityConfig", "@Configuration",
            ["- jwtAuthFilter : JwtAuthFilter"],
            ["+ securityFilterChain(http)",
             "+ passwordEncoder()",
             "+ authenticationManager(cfg)"],
            fill="#FFE0B2", sterebg="#FFCC80")
        add_class(c, "JwtAuthFilter", "JwtAuthFilter", "OncePerRequestFilter",
            ["- jwtUtil : JwtUtil",
             "- userDetailsService : UserDetailsService"],
            ["# doFilterInternal(req,res,chain)"],
            fill="#FFE0B2", sterebg="#FFCC80")
        add_class(c, "JwtUtil", "JwtUtil", "@Component",
            ["- secret : String", "- expirationMs : long"],
            ["+ generateToken(email) : String",
             "+ extractEmail(token) : String",
             "+ validateToken(token,email) : boolean"],
            fill="#FFE0B2", sterebg="#FFCC80")
        add_class(c, "CorsConfig", "CorsConfig", "@Configuration",
            [], ["+ corsFilter() : CorsFilter"],
            fill="#FFE0B2", sterebg="#FFCC80")
        add_class(c, "GlobalExceptionHandler", "GlobalExceptionHandler",
            "@RestControllerAdvice", [],
            ["+ onValidation(e)", "+ onResponseStatus(e)", "+ onOther(e)"],
            fill="#FFE0B2", sterebg="#FFCC80")

    # ----------------- EDGES -----------------
    # Entity composition
    g.edge("User", "Income",      arrowtail="diamond", dir="back", headlabel="1..*", fontsize="10")
    g.edge("User", "Expense",     arrowtail="diamond", dir="back", headlabel="1..*", fontsize="10")
    g.edge("User", "TuitionPlan", arrowtail="diamond", dir="back", headlabel="1..*", fontsize="10")

    # Repository -> Entity
    for r, e in [("UserRepository", "User"),
                 ("IncomeRepository", "Income"),
                 ("ExpenseRepository", "Expense"),
                 ("TuitionPlanRepository", "TuitionPlan")]:
        g.edge(r, e, style="dashed", arrowhead="open", color="#555555")

    # Impl realizes interface
    for iface in ["AuthService", "IncomeService", "ExpenseService",
                  "DashboardService", "TuitionService",
                  "ExpensePredictionService", "WhatIfSimulationService",
                  "AIAdvisorService"]:
        g.edge(iface + "Impl", iface, style="dashed", arrowhead="empty", color="#1565C0")

    # Service -> repository
    for impl, dep in [
        ("AuthServiceImpl", "UserRepository"),
        ("AuthServiceImpl", "JwtUtil"),
        ("IncomeServiceImpl", "IncomeRepository"),
        ("IncomeServiceImpl", "UserRepository"),
        ("ExpenseServiceImpl", "ExpenseRepository"),
        ("ExpenseServiceImpl", "UserRepository"),
        ("DashboardServiceImpl", "IncomeRepository"),
        ("DashboardServiceImpl", "ExpenseRepository"),
        ("DashboardServiceImpl", "UserRepository"),
        ("TuitionServiceImpl", "TuitionPlanRepository"),
        ("TuitionServiceImpl", "DashboardService"),
        ("ExpensePredictionServiceImpl", "ExpenseRepository"),
        ("WhatIfSimulationServiceImpl", "DashboardService"),
        ("AIAdvisorServiceImpl", "DashboardService"),
        ("AIAdvisorServiceImpl", "ExpensePredictionService"),
    ]:
        g.edge(impl, dep, style="dashed", arrowhead="open", color="#555555")

    # Controller -> Service
    for ctrl, svc in [
        ("AuthController", "AuthService"),
        ("IncomeController", "IncomeService"),
        ("ExpenseController", "ExpenseService"),
        ("DashboardController", "DashboardService"),
        ("TuitionController", "TuitionService"),
        ("PredictionController", "ExpensePredictionService"),
        ("SimulationController", "WhatIfSimulationService"),
        ("AIAdvisorController", "AIAdvisorService"),
    ]:
        g.edge(ctrl, svc, arrowhead="vee", color="#C62828")

    # Config wiring
    g.edge("SecurityConfig", "JwtAuthFilter", arrowhead="vee", color="#E65100")
    g.edge("JwtAuthFilter", "JwtUtil",        arrowhead="vee", color="#E65100")

    # Create a 2-column stacked layout per cluster so the diagram is
    # tall-ish without being single-file narrow.  We chain PAIRS of nodes
    # invisibly so dot lays them on alternating ranks.
    def grid_stack(nodes, cols=2, w=30):
        # Force `cols` columns: chain nodes[i] -> nodes[i+cols] to create
        # vertical flow within each column.
        for i in range(len(nodes) - cols):
            g.edge(nodes[i], nodes[i + cols], style="invis", weight=str(w), minlen="1")

    tiers = [
        ("model",   ["User", "Income", "Expense", "TuitionPlan"], 2),
        ("dto",     ["RegisterRequest", "LoginRequest", "AuthResponse",
                     "IncomeDTO", "ExpenseDTO", "DashboardSummaryDTO",
                     "TuitionRequestDTO", "TuitionResultDTO",
                     "PredictionResultDTO", "SimulationRequestDTO",
                     "SimulationResultDTO", "AIQueryDTO", "AIResponseDTO"], 4),
        ("repo",    ["UserRepository", "IncomeRepository",
                     "ExpenseRepository", "TuitionPlanRepository"], 2),
        ("svc",     ["AuthService", "IncomeService", "ExpenseService",
                     "DashboardService", "TuitionService",
                     "ExpensePredictionService", "WhatIfSimulationService",
                     "AIAdvisorService",
                     "AuthServiceImpl", "IncomeServiceImpl", "ExpenseServiceImpl",
                     "DashboardServiceImpl", "TuitionServiceImpl",
                     "ExpensePredictionServiceImpl", "WhatIfSimulationServiceImpl",
                     "AIAdvisorServiceImpl"], 4),
        ("ctrl",    ["AuthController", "IncomeController", "ExpenseController",
                     "DashboardController", "TuitionController",
                     "PredictionController", "SimulationController",
                     "AIAdvisorController"], 4),
        ("cfg",     ["SecurityConfig", "JwtAuthFilter", "JwtUtil",
                     "CorsConfig", "GlobalExceptionHandler"], 3),
    ]
    for _, nodes, cols in tiers:
        grid_stack(nodes, cols=cols, w=40)

    # Bridge last-of-tier to first-of-next-tier so package order is fixed.
    for (n1, t1, _), (n2, t2, _) in zip(tiers, tiers[1:]):
        g.edge(t1[-1], t2[0], style="invis", weight="500", minlen="2")

    return g


# =============================================================================
# DIAGRAM 2 — FRONTEND
# =============================================================================
def build_frontend():
    g = base_graph(
        "Financial Management System — Frontend Class Diagram (React 18 + Vite)\\n"
        "CS 5394 Group 2 · Aakriti Dhakal · Agnes Jesionowska · Manoj Khanal",
        width_in=16, height_in=28, dpi=180,
    )

    with g.subgraph(name="cluster_ctx") as c:
        c.attr(label="context", style="filled", fillcolor="#F1F8E9",
               color="#2E7D32", fontname="Helvetica-Bold", fontsize="14")
        add_class(c, "AuthContext", "AuthContext", "React Context",
            ["+ user : {email, firstName, lastName}",
             "+ token : String", "+ isAuthenticated : boolean"],
            ["+ login(data) : void", "+ logout() : void"],
            fill="#DCEDC8", sterebg="#C5E1A5")

    with g.subgraph(name="cluster_api") as c:
        c.attr(label="api", style="filled", fillcolor="#F1F8E9",
               color="#2E7D32", fontname="Helvetica-Bold", fontsize="14")
        add_class(c, "axiosInstance", "axiosInstance", "axios",
            ['+ baseURL : "/api"',
             "+ request : attach Bearer",
             "+ response : 401 → logout"], [],
            fill="#DCEDC8", sterebg="#C5E1A5")

    with g.subgraph(name="cluster_svc") as c:
        c.attr(label="services", style="filled", fillcolor="#F1F8E9",
               color="#2E7D32", fontname="Helvetica-Bold", fontsize="14")
        svc_methods = {
            "authService":       ["register(payload)", "login(payload)", "logout()"],
            "incomeService":     ["listIncome()", "createIncome(dto)",
                                  "updateIncome(id,dto)", "deleteIncome(id)"],
            "expenseService":    ["listExpense()", "createExpense(dto)",
                                  "updateExpense(id,dto)", "deleteExpense(id)"],
            "dashboardService":  ["getSummary()"],
            "tuitionService":    ["calculate(dto)"],
            "predictionService": ["getPrediction()"],
            "simulationService": ["runSimulation(dto)"],
            "aiService":         ["ask(question)"],
        }
        for s, m in svc_methods.items():
            add_class(c, s, s, "service", [], [f"+ {x}" for x in m],
                      fill="#F1F8E9", sterebg="#DCEDC8")

    with g.subgraph(name="cluster_pages") as c:
        c.attr(label="pages", style="filled", fillcolor="#F9FBE7",
               color="#558B2F", fontname="Helvetica-Bold", fontsize="14")
        pages = ["LoginPage", "RegisterPage", "DashboardPage", "IncomePage",
                 "ExpensePage", "TuitionPlannerPage", "PredictionPage",
                 "SimulationPage", "AIAdvisorPage"]
        for p in pages:
            add_class(c, p, p, "page", [], [],
                      fill="#F9FBE7", sterebg="#F0F4C3")

    with g.subgraph(name="cluster_comp") as c:
        c.attr(label="components", style="filled", fillcolor="#F9FBE7",
               color="#558B2F", fontname="Helvetica-Bold", fontsize="14")
        for comp in ["Navbar", "ProtectedRoute", "SummaryCard", "BudgetChart",
                     "IncomeForm", "ExpenseForm", "TuitionForm",
                     "SimulationForm", "AIChat"]:
            add_class(c, comp, comp, "component", [], [],
                      fill="#FFFDE7", sterebg="#FFF9C4")

    # Edges
    for s in ["authService", "incomeService", "expenseService",
              "dashboardService", "tuitionService", "predictionService",
              "simulationService", "aiService"]:
        g.edge(s, "axiosInstance", arrowhead="vee", color="#2E7D32")

    for page, svc in [
        ("LoginPage", "authService"),
        ("RegisterPage", "authService"),
        ("DashboardPage", "dashboardService"),
        ("IncomePage", "incomeService"),
        ("ExpensePage", "expenseService"),
        ("TuitionPlannerPage", "tuitionService"),
        ("PredictionPage", "predictionService"),
        ("SimulationPage", "simulationService"),
        ("AIAdvisorPage", "aiService"),
    ]:
        g.edge(page, svc, arrowhead="vee", color="#2E7D32")

    for page in ["LoginPage", "RegisterPage"]:
        g.edge(page, "AuthContext", style="dashed", arrowhead="open", color="#2E7D32")
    for comp in ["ProtectedRoute", "Navbar"]:
        g.edge(comp, "AuthContext", style="dashed", arrowhead="open", color="#2E7D32")

    for parent, child in [
        ("DashboardPage", "SummaryCard"),
        ("DashboardPage", "BudgetChart"),
        ("IncomePage", "IncomeForm"),
        ("ExpensePage", "ExpenseForm"),
        ("TuitionPlannerPage", "TuitionForm"),
        ("SimulationPage", "SimulationForm"),
        ("AIAdvisorPage", "AIChat"),
    ]:
        g.edge(parent, child, arrowtail="odiamond", dir="back", color="#2E7D32")

    # Grid-stack each cluster
    def grid_stack(nodes, cols=2, w=30):
        for i in range(len(nodes) - cols):
            g.edge(nodes[i], nodes[i + cols], style="invis",
                   weight=str(w), minlen="1")

    tiers = [
        ["AuthContext"],
        ["axiosInstance"],
        ["authService", "incomeService", "expenseService",
         "dashboardService", "tuitionService", "predictionService",
         "simulationService", "aiService"],
        ["LoginPage", "RegisterPage", "DashboardPage", "IncomePage",
         "ExpensePage", "TuitionPlannerPage", "PredictionPage",
         "SimulationPage", "AIAdvisorPage"],
        ["Navbar", "ProtectedRoute", "SummaryCard", "BudgetChart",
         "IncomeForm", "ExpenseForm", "TuitionForm",
         "SimulationForm", "AIChat"],
    ]
    for t in tiers:
        grid_stack(t, cols=3 if len(t) >= 6 else 2, w=40)
    for t1, t2 in zip(tiers, tiers[1:]):
        g.edge(t1[-1], t2[0], style="invis", weight="500", minlen="2")

    return g


# =============================================================================
# DIAGRAM 3 — COMBINED OVERVIEW (compact)
# =============================================================================
def build_overview():
    g = base_graph(
        "Financial Management System — Overview Class Diagram\\n"
        "CS 5394 Group 2 · Aakriti Dhakal · Agnes Jesionowska · Manoj Khanal",
        width_in=10, height_in=24, dpi=200,
    )

    with g.subgraph(name="cluster_fe") as c:
        c.attr(label="Frontend (React)", style="filled",
               fillcolor="#F1F8E9", color="#2E7D32",
               fontname="Helvetica-Bold", fontsize="14")
        for p in ["Pages", "Components", "Services (JS)", "axiosInstance", "AuthContext"]:
            add_class(c, "FE_" + p.replace(" ", "_").replace("(", "").replace(")", ""),
                      p, "module", [], [],
                      fill="#DCEDC8", sterebg="#C5E1A5")

    with g.subgraph(name="cluster_api") as c:
        c.attr(label="REST API (HTTP + JWT)", style="filled",
               fillcolor="#FFEBEE", color="#C62828",
               fontname="Helvetica-Bold", fontsize="14")
        add_class(c, "Controllers", "8 × @RestController", "REST",
            ["/auth", "/income", "/expense", "/dashboard",
             "/tuition", "/prediction", "/simulation", "/ai"],
            [],
            fill="#FFCDD2", sterebg="#EF9A9A")

    with g.subgraph(name="cluster_svc") as c:
        c.attr(label="Business Layer (Services)", style="filled",
               fillcolor="#E3F2FD", color="#1565C0",
               fontname="Helvetica-Bold", fontsize="14")
        add_class(c, "Services", "8 × @Service", "interface + impl",
            ["AuthService", "IncomeService", "ExpenseService",
             "DashboardService", "TuitionService",
             "ExpensePredictionService",
             "WhatIfSimulationService", "AIAdvisorService"], [],
            fill="#BBDEFB", sterebg="#90CAF9")

    with g.subgraph(name="cluster_repo") as c:
        c.attr(label="Data Access Layer", style="filled",
               fillcolor="#FBEAFF", color="#6A1B9A",
               fontname="Helvetica-Bold", fontsize="14")
        add_class(c, "Repositories", "4 × JpaRepository", "interface",
            ["UserRepository", "IncomeRepository",
             "ExpenseRepository", "TuitionPlanRepository"], [],
            fill="#F3E5F5", sterebg="#E1BEE7")

    with g.subgraph(name="cluster_model") as c:
        c.attr(label="Model (JPA Entities)", style="filled",
               fillcolor="#F4F8FC", color="#4A6FA5",
               fontname="Helvetica-Bold", fontsize="14")
        add_class(c, "Entities", "4 × @Entity", "persistent",
            ["User", "Income", "Expense", "TuitionPlan"], [],
            fill="#E8F5E9", sterebg="#C8E6C9")

    with g.subgraph(name="cluster_cfg") as c:
        c.attr(label="Security / Config", style="filled",
               fillcolor="#FFF3E0", color="#E65100",
               fontname="Helvetica-Bold", fontsize="14")
        add_class(c, "Security", "Security Stack", "@Configuration",
            ["SecurityConfig", "JwtAuthFilter", "JwtUtil",
             "CorsConfig", "GlobalExceptionHandler"], [],
            fill="#FFE0B2", sterebg="#FFCC80")

    with g.subgraph(name="cluster_ext") as c:
        c.attr(label="External", style="filled",
               fillcolor="#ECEFF1", color="#37474F",
               fontname="Helvetica-Bold", fontsize="14")
        add_class(c, "PostgreSQL", "PostgreSQL", "database",
            ["fms_db"], [],
            fill="#CFD8DC", sterebg="#B0BEC5")
        add_class(c, "OpenAI", "OpenAI API", "external service",
            ["chat/completions (gpt-4o-mini)"], [],
            fill="#CFD8DC", sterebg="#B0BEC5")

    # Edges
    g.edge("FE_Pages", "FE_Components",      arrowhead="vee", color="#2E7D32")
    g.edge("FE_Pages", "FE_Services_JS",     arrowhead="vee", color="#2E7D32")
    g.edge("FE_Services_JS", "FE_axiosInstance", arrowhead="vee", color="#2E7D32")
    g.edge("FE_Pages", "FE_AuthContext",     style="dashed", arrowhead="open", color="#2E7D32")
    g.edge("FE_axiosInstance", "Controllers",
           label="HTTPS + Bearer", arrowhead="vee", color="#455A64", penwidth="2")
    g.edge("Security", "Controllers",
           style="dashed", arrowhead="open", color="#E65100",
           label="JwtAuthFilter")
    g.edge("Controllers", "Services",   arrowhead="vee", color="#C62828")
    g.edge("Services", "Repositories",  arrowhead="vee", color="#1565C0")
    g.edge("Repositories", "Entities",  style="dashed", arrowhead="open", color="#6A1B9A")
    g.edge("Entities", "PostgreSQL",
           label="Hibernate / JPA", arrowhead="vee", color="#455A64")
    g.edge("Services", "OpenAI",
           label="AIAdvisorService", style="dashed", arrowhead="vee", color="#1565C0")

    # Force layering
    chain = ["FE_Pages", "Controllers", "Services", "Repositories",
             "Entities", "PostgreSQL"]
    for a, b in zip(chain, chain[1:]):
        g.edge(a, b, style="invis", weight="200")

    return g


# =============================================================================
# Render all three
# =============================================================================
if __name__ == "__main__":
    for fmt in ("png", "svg"):
        backend = build_backend()
        backend.format = fmt
        backend.render(filename="ClassDiagram_Backend",
                       directory=str(OUT_DIR), cleanup=False)

        frontend = build_frontend()
        frontend.format = fmt
        frontend.render(filename="ClassDiagram_Frontend",
                        directory=str(OUT_DIR), cleanup=False)

        overview = build_overview()
        overview.format = fmt
        overview.render(filename="ClassDiagram",
                        directory=str(OUT_DIR), cleanup=False)

    print("Done.")
