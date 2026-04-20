"""Render the second set of FMS diagrams, styled to match the user's samples.

Produces THREE diagrams:
  1. ClassDiagram_v2.png      — Clean domain-model UML class diagram.
  2. MVC.png                  — Three-column Model | View | Controller
                                package diagram (matches sample 1 style:
                                tabbed blue packages, composition diamonds,
                                dashed «use» arrows).
  3. ReverseClassDiagram.png  — IDE-style reverse-engineered class diagram
                                (matches sample 2 style: pale-yellow class
                                boxes with «Java Class» / «Java Interface»
                                stereotype header and package label below
                                class name, dense association lines).

Rendered with Graphviz DOT — no external UML tool required.
"""
from pathlib import Path
from graphviz import Digraph

OUT_DIR = Path("/sessions/zealous-nice-faraday/mnt/Financial-Management-System/docs/diagrams")
OUT_DIR.mkdir(parents=True, exist_ok=True)


# =============================================================================
# Shared node builders
# =============================================================================
def uml_plain(name, stereotype, attrs, methods, fill="#FAFAFA", sterebg="#E3F2FD"):
    """Generic 3-compartment UML node (stereotype, name, attrs, methods)."""
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


def uml_mvc(name, attrs, methods, fill="#FFFFFF"):
    """Simple MVC-style class box (no stereotype header) — matches sample 1."""
    parts = [f'<TABLE BORDER="1" CELLBORDER="0" CELLSPACING="0" CELLPADDING="3" BGCOLOR="{fill}">']
    parts.append(f'<TR><TD ALIGN="CENTER"><B>{name}</B></TD></TR>')
    parts.append('<HR/>')
    for a in (attrs or [" "]):
        parts.append(f'<TR><TD ALIGN="LEFT">{a}</TD></TR>')
    if methods:
        parts.append('<HR/>')
        for m in methods:
            parts.append(f'<TR><TD ALIGN="LEFT">{m}</TD></TR>')
    parts.append('</TABLE>')
    return "<" + "".join(parts) + ">"


def uml_reverse(name, package, kind, attrs, methods,
                fill="#FFFDE7", sterebg="#FFF59D", iface=False):
    """IDE-style reverse-engineered class box — matches sample 2.

    Top row:    «Java Class» or «Java Interface» (stereotype)
    Second:     class name (bold)
    Third:      package path (small italic)
    Then:       attributes, horizontal rule, methods
    """
    stereo = "Java Interface" if iface else "Java Class"
    parts = [f'<TABLE BORDER="1" CELLBORDER="0" CELLSPACING="0" CELLPADDING="3" BGCOLOR="{fill}">']
    parts.append(
        f'<TR><TD BGCOLOR="{sterebg}" ALIGN="CENTER">'
        f'<FONT POINT-SIZE="10"><I>&#171;{stereo}&#187;</I></FONT></TD></TR>'
    )
    parts.append(
        f'<TR><TD BGCOLOR="{fill}" ALIGN="CENTER">'
        f'<B>{name}</B></TD></TR>'
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


def base_graph(title, width_in=20, height_in=28, dpi=180, rankdir="TB"):
    g = Digraph(format="png")
    g.attr(rankdir=rankdir,
           splines="spline",
           nodesep="0.4",
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
           labeljust="c")
    g.attr("node", shape="plain", fontname="Helvetica", fontsize="11")
    g.attr("edge", fontname="Helvetica", fontsize="9", arrowsize="0.8", penwidth="1.1")
    return g


def grid_stack(g, nodes, cols=2, w=40):
    for i in range(len(nodes) - cols):
        g.edge(nodes[i], nodes[i + cols], style="invis",
               weight=str(w), minlen="1")


# =============================================================================
# DIAGRAM 1 — CLASS DIAGRAM (domain model)
# =============================================================================
def build_class_diagram():
    """Clean, domain-focused UML class diagram.

    Central User entity composes Income, Expense and TuitionPlan.
    DTOs grouped by use case (auth, transactional, analytical, AI).
    Key UML notations: composition (filled diamond), aggregation (open
    diamond), dependency (dashed open arrow), stereotypes «@Entity»/«DTO».
    """
    g = base_graph(
        "Financial Management System — Class Diagram (Domain Model)\\n"
        "CS 5394 Group 2 · Aakriti Dhakal · Agnes Jesionowska · Manoj Khanal",
        width_in=14, height_in=22, dpi=180,
    )

    def add(gg, nid, name, stereo, attrs, methods, fill, ster):
        gg.node(nid, uml_plain(name, stereo, attrs, methods, fill=fill, sterebg=ster))

    # Entities ----------------------------------------------------------------
    with g.subgraph(name="cluster_entities") as c:
        c.attr(label="Domain Entities  (com.fms.model)", style="filled",
               fillcolor="#F4F8FC", color="#4A6FA5",
               fontname="Helvetica-Bold", fontsize="14")
        add(c, "User", "User", "@Entity",
            ["- id : Long",
             "- firstName : String",
             "- lastName : String",
             "- email : String  {unique}",
             "- passwordHash : String",
             "- createdAt : LocalDateTime"],
            ["+ getId() : Long",
             "+ getEmail() : String",
             "+ getFullName() : String",
             "# onCreate() : void  @PrePersist"],
            "#E8F5E9", "#A5D6A7")
        add(c, "Income", "Income", "@Entity",
            ["- id : Long",
             "- amount : BigDecimal",
             "- source : String",
             "- date : LocalDate",
             "- description : String"],
            ["+ getAmount() : BigDecimal",
             "+ getSource() : String",
             "+ getDate() : LocalDate"],
            "#E8F5E9", "#A5D6A7")
        add(c, "Expense", "Expense", "@Entity",
            ["- id : Long",
             "- amount : BigDecimal",
             "- category : String",
             "- date : LocalDate",
             "- description : String"],
            ["+ getAmount() : BigDecimal",
             "+ getCategory() : String",
             "+ getDate() : LocalDate"],
            "#E8F5E9", "#A5D6A7")
        add(c, "TuitionPlan", "TuitionPlan", "@Entity",
            ["- id : Long",
             "- tuitionPerCourse : BigDecimal",
             "- numberOfCourses : Integer",
             "- scholarshipAmount : BigDecimal",
             "- createdAt : LocalDateTime"],
            ["+ getTuitionPerCourse() : BigDecimal",
             "+ getNumberOfCourses() : Integer",
             "# onCreate() : void  @PrePersist"],
            "#E8F5E9", "#A5D6A7")

    # Auth DTOs ---------------------------------------------------------------
    with g.subgraph(name="cluster_auth") as c:
        c.attr(label="Authentication DTOs", style="filled",
               fillcolor="#FFF3E0", color="#E65100",
               fontname="Helvetica-Bold", fontsize="14")
        add(c, "RegisterRequest", "RegisterRequest", "DTO",
            ["+ firstName : String  @NotBlank",
             "+ lastName : String  @NotBlank",
             "+ email : String  @Email",
             "+ password : String  @Size(min=8)"], [],
            "#FFE0B2", "#FFCC80")
        add(c, "LoginRequest", "LoginRequest", "DTO",
            ["+ email : String  @Email",
             "+ password : String  @NotBlank"], [],
            "#FFE0B2", "#FFCC80")
        add(c, "AuthResponse", "AuthResponse", "DTO",
            ["+ token : String",
             "+ email : String",
             "+ firstName : String",
             "+ lastName : String"], [],
            "#FFE0B2", "#FFCC80")

    # Transactional DTOs ------------------------------------------------------
    with g.subgraph(name="cluster_tx") as c:
        c.attr(label="Transactional DTOs", style="filled",
               fillcolor="#FFFDE7", color="#F9A825",
               fontname="Helvetica-Bold", fontsize="14")
        add(c, "IncomeDTO", "IncomeDTO", "DTO",
            ["+ id : Long",
             "+ amount : BigDecimal  @DecimalMin",
             "+ source : String  @NotBlank",
             "+ date : LocalDate",
             "+ description : String"], [],
            "#FFF8E1", "#FFECB3")
        add(c, "ExpenseDTO", "ExpenseDTO", "DTO",
            ["+ id : Long",
             "+ amount : BigDecimal  @DecimalMin",
             "+ category : String  @NotBlank",
             "+ date : LocalDate",
             "+ description : String"], [],
            "#FFF8E1", "#FFECB3")

    # Analytical DTOs ---------------------------------------------------------
    with g.subgraph(name="cluster_analytics") as c:
        c.attr(label="Analytical / Calculation DTOs", style="filled",
               fillcolor="#E3F2FD", color="#1565C0",
               fontname="Helvetica-Bold", fontsize="14")
        add(c, "DashboardSummaryDTO", "DashboardSummaryDTO", "DTO",
            ["+ totalIncome : BigDecimal",
             "+ totalExpenses : BigDecimal",
             "+ netBalance : BigDecimal",
             "+ recentIncome : List&lt;IncomeDTO&gt;",
             "+ recentExpenses : List&lt;ExpenseDTO&gt;"], [],
            "#BBDEFB", "#90CAF9")
        add(c, "TuitionRequestDTO", "TuitionRequestDTO", "DTO",
            ["+ tuitionPerCourse : BigDecimal  @DecimalMin",
             "+ numberOfCourses : Integer  @Min(1)",
             "+ scholarshipAmount : BigDecimal"], [],
            "#BBDEFB", "#90CAF9")
        add(c, "TuitionResultDTO", "TuitionResultDTO", "DTO",
            ["+ tuitionPerCourse : BigDecimal",
             "+ numberOfCourses : Integer",
             "+ scholarshipAmount : BigDecimal",
             "+ grossTuition : BigDecimal",
             "+ netTuition : BigDecimal"], [],
            "#BBDEFB", "#90CAF9")
        add(c, "SimulationRequestDTO", "SimulationRequestDTO", "DTO",
            ["+ hypotheticalMonthlyIncome : BigDecimal",
             "+ hypotheticalMonthlyExpenses : BigDecimal",
             "+ months : Integer  @Min(1) @Max(60)"], [],
            "#BBDEFB", "#90CAF9")
        add(c, "SimulationResultDTO", "SimulationResultDTO", "DTO",
            ["+ projectedFinalBalance : BigDecimal",
             "+ projectedTotalSavings : BigDecimal",
             "+ monthlyBalances : List&lt;BigDecimal&gt;"], [],
            "#BBDEFB", "#90CAF9")

    # AI DTOs -----------------------------------------------------------------
    with g.subgraph(name="cluster_ai") as c:
        c.attr(label="AI Advisor DTOs", style="filled",
               fillcolor="#FCE4EC", color="#AD1457",
               fontname="Helvetica-Bold", fontsize="14")
        add(c, "AIQueryDTO", "AIQueryDTO", "DTO",
            ["+ question : String  @NotBlank"], [],
            "#F8BBD0", "#F48FB1")
        add(c, "AIResponseDTO", "AIResponseDTO", "DTO",
            ["+ answer : String",
             "+ model : String",
             "+ generatedAt : Instant"], [],
            "#F8BBD0", "#F48FB1")

    # Relationships ----------------------------------------------------------
    for e in ["Income", "Expense", "TuitionPlan"]:
        g.edge("User", e, arrowtail="diamond", dir="back",
               headlabel="1..*", taillabel="1", fontsize="10",
               color="#2E7D32")

    for dto, ent in [("IncomeDTO", "Income"),
                     ("ExpenseDTO", "Expense"),
                     ("TuitionResultDTO", "TuitionPlan"),
                     ("AuthResponse", "User")]:
        g.edge(dto, ent, style="dashed", arrowhead="open",
               color="#666666", label="maps", fontsize="9")

    g.edge("DashboardSummaryDTO", "IncomeDTO",
           arrowtail="odiamond", dir="back", color="#1565C0",
           label="0..*", fontsize="9")
    g.edge("DashboardSummaryDTO", "ExpenseDTO",
           arrowtail="odiamond", dir="back", color="#1565C0",
           label="0..*", fontsize="9")

    grid_stack(g, ["User", "Income", "Expense", "TuitionPlan"], cols=2)
    grid_stack(g, ["RegisterRequest", "LoginRequest", "AuthResponse"], cols=3)
    grid_stack(g, ["IncomeDTO", "ExpenseDTO"], cols=2)
    grid_stack(g, ["DashboardSummaryDTO", "TuitionRequestDTO",
                   "TuitionResultDTO", "SimulationRequestDTO",
                   "SimulationResultDTO"], cols=3)
    grid_stack(g, ["AIQueryDTO", "AIResponseDTO"], cols=2)

    for a, b in [("TuitionPlan", "RegisterRequest"),
                 ("AuthResponse", "IncomeDTO"),
                 ("ExpenseDTO", "DashboardSummaryDTO"),
                 ("SimulationResultDTO", "AIQueryDTO")]:
        g.edge(a, b, style="invis", weight="300", minlen="2")

    return g


# =============================================================================
# DIAGRAM 2 — MVC (three-column package diagram, sample 1 style)
# =============================================================================
def build_mvc():
    g = base_graph(
        "Financial Management System — Model · View · Controller\\n"
        "CS 5394 Group 2 · Aakriti Dhakal · Agnes Jesionowska · Manoj Khanal",
        width_in=22, height_in=16, dpi=180, rankdir="LR",
    )
    g.attr(nodesep="0.45", ranksep="1.2")

    pkg_fill, pkg_border = "#BFDCEE", "#4A6FA5"  # matches sample 1

    # --- VIEW package --------------------------------------------------------
    with g.subgraph(name="cluster_view") as v:
        v.attr(label="View", style="filled,rounded",
               fillcolor=pkg_fill, color=pkg_border,
               fontname="Helvetica-Bold", fontsize="18", labelloc="t",
               penwidth="2")
        v.node("V_LoginPage",     uml_mvc("LoginPage",
            ["+ email : String", "+ password : String"],
            ["+ handleSubmit() : void", "+ render() : JSX"]))
        v.node("V_RegisterPage",  uml_mvc("RegisterPage",
            ["+ firstName, lastName", "+ email, password"],
            ["+ handleSubmit() : void", "+ render() : JSX"]))
        v.node("V_Dashboard",     uml_mvc("DashboardPage",
            ["+ summary : DashboardSummary"],
            ["+ useEffect() : void", "+ render() : JSX"]))
        v.node("V_IncomePage",    uml_mvc("IncomePage",
            ["+ items : IncomeDTO[]"],
            ["+ fetchAll() : void", "+ render() : JSX"]))
        v.node("V_ExpensePage",   uml_mvc("ExpensePage",
            ["+ items : ExpenseDTO[]"],
            ["+ fetchAll() : void", "+ render() : JSX"]))
        v.node("V_TuitionPage",   uml_mvc("TuitionPlannerPage",
            ["+ form : TuitionRequest"],
            ["+ handleSubmit() : void"]))
        v.node("V_PredictPage",   uml_mvc("PredictionPage",
            ["+ prediction : List"],
            ["+ fetch() : void"]))
        v.node("V_SimPage",       uml_mvc("SimulationPage",
            ["+ form : SimulationRequest"],
            ["+ runSimulation() : void"]))
        v.node("V_AIPage",        uml_mvc("AIAdvisorPage",
            ["+ chat : ChatMessage[]"],
            ["+ ask(q) : void"]))
        v.node("V_Navbar",        uml_mvc("Navbar",
            ["+ user : AuthUser"],
            ["+ logout() : void"]))
        v.node("V_Protected",     uml_mvc("ProtectedRoute",
            ["+ children : ReactNode"],
            ["+ guard() : JSX"]))
        v.node("V_Summary",       uml_mvc("SummaryCard",
            ["+ title : String", "+ value : Number"], []))
        v.node("V_BudgetChart",   uml_mvc("BudgetChart",
            ["+ data : number[]"], ["+ render() : JSX"]))
        v.node("V_IncomeForm",    uml_mvc("IncomeForm", ["+ dto : IncomeDTO"], ["+ submit()"]))
        v.node("V_ExpenseForm",   uml_mvc("ExpenseForm", ["+ dto : ExpenseDTO"], ["+ submit()"]))
        v.node("V_TuitionForm",   uml_mvc("TuitionForm", ["+ dto : TuitionRequestDTO"], ["+ submit()"]))
        v.node("V_SimForm",       uml_mvc("SimulationForm", ["+ dto : SimulationRequestDTO"], ["+ submit()"]))
        v.node("V_AIChat",        uml_mvc("AIChat", ["+ messages : Array"], ["+ send()"]))
        v.node("V_Auth",          uml_mvc("AuthContext",
            ["+ user", "+ token", "+ isAuthenticated"],
            ["+ login()", "+ logout()"]))

    # --- CONTROLLER package --------------------------------------------------
    with g.subgraph(name="cluster_controller") as ctrl:
        ctrl.attr(label="Controller", style="filled,rounded",
                  fillcolor=pkg_fill, color=pkg_border,
                  fontname="Helvetica-Bold", fontsize="18", labelloc="t",
                  penwidth="2")
        ctrl.node("C_Auth",  uml_mvc("AuthController",
            ["- authService : AuthService"],
            ["+ POST /api/auth/register",
             "+ POST /api/auth/login"]))
        ctrl.node("C_Income", uml_mvc("IncomeController",
            ["- incomeService : IncomeService"],
            ["+ GET /api/income",
             "+ POST /api/income",
             "+ PUT /api/income/{id}",
             "+ DELETE /api/income/{id}"]))
        ctrl.node("C_Expense", uml_mvc("ExpenseController",
            ["- expenseService : ExpenseService"],
            ["+ GET /api/expense",
             "+ POST /api/expense",
             "+ PUT /api/expense/{id}",
             "+ DELETE /api/expense/{id}"]))
        ctrl.node("C_Dash", uml_mvc("DashboardController",
            ["- dashboardService"],
            ["+ GET /api/dashboard/summary"]))
        ctrl.node("C_Tuition", uml_mvc("TuitionController",
            ["- tuitionService"],
            ["+ POST /api/tuition/calculate"]))
        ctrl.node("C_Pred", uml_mvc("PredictionController",
            ["- expensePredictionService"],
            ["+ GET /api/prediction/expenses"]))
        ctrl.node("C_Sim", uml_mvc("SimulationController",
            ["- whatIfSimulationService"],
            ["+ POST /api/simulation/run"]))
        ctrl.node("C_AI", uml_mvc("AIAdvisorController",
            ["- aiAdvisorService"],
            ["+ POST /api/ai/ask"]))
        ctrl.node("C_Jwt", uml_mvc("JwtAuthFilter",
            ["- jwtUtil : JwtUtil"],
            ["# doFilterInternal()"]))
        ctrl.node("C_Sec", uml_mvc("SecurityConfig",
            ["@EnableWebSecurity"],
            ["+ securityFilterChain()",
             "+ passwordEncoder()"]))

    # --- MODEL package -------------------------------------------------------
    with g.subgraph(name="cluster_model") as m:
        m.attr(label="Model", style="filled,rounded",
               fillcolor=pkg_fill, color=pkg_border,
               fontname="Helvetica-Bold", fontsize="18", labelloc="t",
               penwidth="2")
        m.node("M_User", uml_mvc("User",
            ["- id : Long",
             "- email : String  {unique}",
             "- passwordHash : String",
             "- firstName, lastName",
             "- createdAt : LocalDateTime"],
            ["+ getters / setters",
             "# onCreate() : @PrePersist"]))
        m.node("M_Income", uml_mvc("Income",
            ["- id : Long",
             "- amount : BigDecimal",
             "- source, date, description",
             "- user : User (@ManyToOne)"],
            ["+ getters / setters"]))
        m.node("M_Expense", uml_mvc("Expense",
            ["- id : Long",
             "- amount : BigDecimal",
             "- category, date, description",
             "- user : User (@ManyToOne)"],
            ["+ getters / setters"]))
        m.node("M_Tuition", uml_mvc("TuitionPlan",
            ["- id : Long",
             "- tuitionPerCourse, numberOfCourses",
             "- scholarshipAmount",
             "- createdAt, user : User"],
            ["+ getters / setters"]))
        m.node("M_UserRepo", uml_mvc("UserRepository",
            ["«JpaRepository»"],
            ["+ findByEmail(e) : Optional&lt;User&gt;",
             "+ existsByEmail(e) : boolean"]))
        m.node("M_IncomeRepo", uml_mvc("IncomeRepository",
            ["«JpaRepository»"],
            ["+ findByUser(u)",
             "+ findByUserOrderByDateDesc(u)"]))
        m.node("M_ExpenseRepo", uml_mvc("ExpenseRepository",
            ["«JpaRepository»"],
            ["+ findByUser(u)",
             "+ findByUserOrderByDateDesc(u)"]))
        m.node("M_TuitionRepo", uml_mvc("TuitionPlanRepository",
            ["«JpaRepository»"],
            ["+ findByUser(u)",
             "+ findByUserOrderByCreatedAtDesc(u)"]))
        m.node("M_Services", uml_mvc("Business Services (8)",
            ["AuthService, IncomeService",
             "ExpenseService, DashboardService",
             "TuitionService, AIAdvisorService",
             "ExpensePredictionService",
             "WhatIfSimulationService"],
            ["+ interface + @Service impl",
             "+ calls repositories + OpenAI"]))

    # --- Edges (cross-package request flow) ----------------------------------
    # View internal composition (pages compose components)
    for parent, child in [("V_Dashboard", "V_Summary"),
                          ("V_Dashboard", "V_BudgetChart"),
                          ("V_IncomePage", "V_IncomeForm"),
                          ("V_ExpensePage", "V_ExpenseForm"),
                          ("V_TuitionPage", "V_TuitionForm"),
                          ("V_SimPage", "V_SimForm"),
                          ("V_AIPage", "V_AIChat")]:
        g.edge(parent, child, arrowtail="diamond", dir="back",
               color="#2E7D32")

    # View → Controller (dashed «use» over HTTPS)
    for view, ctrl_node in [("V_LoginPage", "C_Auth"),
                            ("V_RegisterPage", "C_Auth"),
                            ("V_Dashboard", "C_Dash"),
                            ("V_IncomePage", "C_Income"),
                            ("V_ExpensePage", "C_Expense"),
                            ("V_TuitionPage", "C_Tuition"),
                            ("V_PredictPage", "C_Pred"),
                            ("V_SimPage", "C_Sim"),
                            ("V_AIPage", "C_AI")]:
        g.edge(view, ctrl_node, style="dashed", arrowhead="open",
               label="«use»", fontsize="9", color="#37474F")

    # Controller → Controller (Jwt gates all non-auth)
    for ctrl_node in ["C_Income", "C_Expense", "C_Dash", "C_Tuition",
                      "C_Pred", "C_Sim", "C_AI"]:
        g.edge("C_Jwt", ctrl_node, style="dashed", arrowhead="open",
               color="#C62828", label="«filter»", fontsize="9")
    g.edge("C_Sec", "C_Jwt", arrowhead="vee", color="#C62828")

    # Controller → Model (via services)
    for ctrl_node in ["C_Auth", "C_Income", "C_Expense", "C_Dash",
                      "C_Tuition", "C_Pred", "C_Sim", "C_AI"]:
        g.edge(ctrl_node, "M_Services", style="dashed", arrowhead="open",
               label="«use»", fontsize="9", color="#37474F")

    # Model internal (service → repo, repo → entity, User composes others)
    g.edge("M_Services", "M_UserRepo",    arrowhead="vee", color="#1565C0")
    g.edge("M_Services", "M_IncomeRepo",  arrowhead="vee", color="#1565C0")
    g.edge("M_Services", "M_ExpenseRepo", arrowhead="vee", color="#1565C0")
    g.edge("M_Services", "M_TuitionRepo", arrowhead="vee", color="#1565C0")
    g.edge("M_UserRepo",   "M_User",    style="dashed", arrowhead="open", color="#6A1B9A")
    g.edge("M_IncomeRepo", "M_Income",  style="dashed", arrowhead="open", color="#6A1B9A")
    g.edge("M_ExpenseRepo","M_Expense", style="dashed", arrowhead="open", color="#6A1B9A")
    g.edge("M_TuitionRepo","M_Tuition", style="dashed", arrowhead="open", color="#6A1B9A")
    for e in ["M_Income", "M_Expense", "M_Tuition"]:
        g.edge("M_User", e, arrowtail="diamond", dir="back",
               color="#2E7D32", headlabel="1..*", fontsize="9")

    # AuthContext dashed dependency
    g.edge("V_Protected", "V_Auth", style="dashed", arrowhead="open",
           color="#2E7D32", label="«use»", fontsize="9")
    g.edge("V_Navbar", "V_Auth", style="dashed", arrowhead="open",
           color="#2E7D32", label="«use»", fontsize="9")

    # Stack each package's nodes into columns
    grid_stack(g, ["V_LoginPage", "V_RegisterPage", "V_Dashboard",
                   "V_IncomePage", "V_ExpensePage", "V_TuitionPage",
                   "V_PredictPage", "V_SimPage", "V_AIPage",
                   "V_Navbar", "V_Protected", "V_Auth",
                   "V_Summary", "V_BudgetChart",
                   "V_IncomeForm", "V_ExpenseForm", "V_TuitionForm",
                   "V_SimForm", "V_AIChat"], cols=3, w=60)
    grid_stack(g, ["C_Sec", "C_Jwt", "C_Auth", "C_Income", "C_Expense",
                   "C_Dash", "C_Tuition", "C_Pred", "C_Sim", "C_AI"],
               cols=2, w=60)
    grid_stack(g, ["M_User", "M_Income", "M_Expense", "M_Tuition",
                   "M_UserRepo", "M_IncomeRepo", "M_ExpenseRepo",
                   "M_TuitionRepo", "M_Services"], cols=2, w=60)

    return g


# =============================================================================
# DIAGRAM 3 — REVERSE CLASS DIAGRAM (IDE-style, sample 2)
# =============================================================================
def build_reverse_class_diagram():
    """IDE-style reverse-engineered class diagram, matching sample 2.

    Pale-yellow class boxes with «Java Class»/«Java Interface» stereotype,
    package label below class name, attributes and methods listed as-is.
    Reflects the ACTUAL source: TODO stubs, `String userEmail` parameters,
    no expenseByCategory on DashboardSummaryDTO, etc.
    """
    g = base_graph(
        "Financial Management System — Reverse Class Diagram\\n"
        "Reverse-engineered from actual source  (TODO stubs preserved)\\n"
        "CS 5394 Group 2 · Aakriti Dhakal · Agnes Jesionowska · Manoj Khanal",
        width_in=24, height_in=36, dpi=170,
    )
    g.attr(nodesep="0.35", ranksep="0.9")

    YF, YS = "#FFFDE7", "#FFF59D"   # yellow body + slightly darker header

    def jc(nid, name, pkg, attrs, methods, iface=False):
        g.node(nid, uml_reverse(name, pkg, None, attrs, methods,
                                fill=YF, sterebg=YS, iface=iface))

    # -------- Entities -------------------------------------------------------
    jc("X_User", "User", "com.fms.model",
       ["- id : Long",
        "- firstName : String",
        "- lastName : String",
        "- email : String  {unique}",
        "- passwordHash : String",
        "- createdAt : LocalDateTime"],
       ["+ (Lombok) getters/setters",
        "# onCreate() : void  @PrePersist"])
    jc("X_Income", "Income", "com.fms.model",
       ["- id : Long",
        "- user : User  @ManyToOne(LAZY)",
        "- amount : BigDecimal",
        "- source : String",
        "- date : LocalDate",
        "- description : String"],
       ["+ (Lombok) getters/setters"])
    jc("X_Expense", "Expense", "com.fms.model",
       ["- id : Long",
        "- user : User  @ManyToOne(LAZY)",
        "- amount : BigDecimal",
        "- category : String",
        "- date : LocalDate",
        "- description : String"],
       ["+ (Lombok) getters/setters"])
    jc("X_TuitionPlan", "TuitionPlan", "com.fms.model",
       ["- id : Long",
        "- user : User  @ManyToOne(LAZY)",
        "- tuitionPerCourse : BigDecimal",
        "- numberOfCourses : Integer",
        "- scholarshipAmount : BigDecimal",
        "- createdAt : LocalDateTime"],
       ["+ (Lombok) getters/setters",
        "# onCreate() : void  @PrePersist"])

    # -------- DTOs -----------------------------------------------------------
    jc("X_RegisterRequest", "RegisterRequest", "com.fms.dto",
       ["+ firstName : String", "+ lastName : String",
        "+ email : String", "+ password : String"], [])
    jc("X_LoginRequest", "LoginRequest", "com.fms.dto",
       ["+ email : String", "+ password : String"], [])
    jc("X_AuthResponse", "AuthResponse", "com.fms.dto",
       ["+ token : String", "+ email : String",
        "+ firstName : String", "+ lastName : String"], [])
    jc("X_IncomeDTO", "IncomeDTO", "com.fms.dto",
       ["+ id : Long", "+ amount : BigDecimal",
        "+ source : String", "+ date : LocalDate",
        "+ description : String"], [])
    jc("X_ExpenseDTO", "ExpenseDTO", "com.fms.dto",
       ["+ id : Long", "+ amount : BigDecimal",
        "+ category : String", "+ date : LocalDate",
        "+ description : String"], [])
    jc("X_DashSummary", "DashboardSummaryDTO", "com.fms.dto",
       ["+ totalIncome : BigDecimal",
        "+ totalExpenses : BigDecimal",
        "+ netBalance : BigDecimal",
        "+ recentIncome : List&lt;IncomeDTO&gt;",
        "+ recentExpenses : List&lt;ExpenseDTO&gt;"], [])
    jc("X_TuitionReq", "TuitionRequestDTO", "com.fms.dto",
       ["+ tuitionPerCourse : BigDecimal",
        "+ numberOfCourses : Integer",
        "+ scholarshipAmount : BigDecimal"], [])
    jc("X_TuitionRes", "TuitionResultDTO", "com.fms.dto",
       ["+ tuitionPerCourse : BigDecimal",
        "+ numberOfCourses : Integer",
        "+ scholarshipAmount : BigDecimal",
        "+ grossTuition : BigDecimal",
        "+ netTuition : BigDecimal"], [])
    jc("X_SimReq", "SimulationRequestDTO", "com.fms.dto",
       ["+ hypotheticalMonthlyIncome : BigDecimal",
        "+ hypotheticalMonthlyExpenses : BigDecimal",
        "+ months : Integer"], [])
    jc("X_SimRes", "SimulationResultDTO", "com.fms.dto",
       ["+ projectedFinalBalance : BigDecimal",
        "+ projectedTotalSavings : BigDecimal",
        "+ monthlyBalances : List&lt;BigDecimal&gt;"], [])
    jc("X_AIQuery", "AIQueryDTO", "com.fms.dto",
       ["+ question : String"], [])
    jc("X_AIResp", "AIResponseDTO", "com.fms.dto",
       ["+ answer : String",
        "+ model : String",
        "+ generatedAt : Instant"], [])

    # -------- Repositories (interfaces) --------------------------------------
    jc("X_UserRepo", "UserRepository", "com.fms.repository",
       ["extends JpaRepository&lt;User, Long&gt;"],
       ["+ findByEmail(email) : Optional&lt;User&gt;",
        "+ existsByEmail(email) : boolean"], iface=True)
    jc("X_IncomeRepo", "IncomeRepository", "com.fms.repository",
       ["extends JpaRepository&lt;Income, Long&gt;"],
       ["+ findByUser(user) : List&lt;Income&gt;",
        "+ findByUserOrderByDateDesc(user) : List&lt;Income&gt;"], iface=True)
    jc("X_ExpenseRepo", "ExpenseRepository", "com.fms.repository",
       ["extends JpaRepository&lt;Expense, Long&gt;"],
       ["+ findByUser(user) : List&lt;Expense&gt;",
        "+ findByUserOrderByDateDesc(user) : List&lt;Expense&gt;"], iface=True)
    jc("X_TuitionRepo", "TuitionPlanRepository", "com.fms.repository",
       ["extends JpaRepository&lt;TuitionPlan, Long&gt;"],
       ["+ findByUser(user) : List&lt;TuitionPlan&gt;",
        "+ findByUserOrderByCreatedAtDesc(user) : List&lt;TuitionPlan&gt;"], iface=True)

    # -------- Services (interfaces + impls) ----------------------------------
    jc("X_AuthService", "AuthService", "com.fms.service",
       [],
       ["+ register(RegisterRequest) : AuthResponse",
        "+ login(LoginRequest) : AuthResponse"], iface=True)
    jc("X_AuthServiceImpl", "AuthServiceImpl", "com.fms.service",
       ["implements AuthService"],
       ["+ register() : AuthResponse  // TODO: returns null",
        "+ login() : AuthResponse  // TODO: returns null"])
    jc("X_IncomeService", "IncomeService", "com.fms.service",
       [],
       ["+ getAllByUser(String userEmail) : List&lt;IncomeDTO&gt;",
        "+ add(String userEmail, IncomeDTO) : IncomeDTO",
        "+ update(Long id, IncomeDTO) : IncomeDTO",
        "+ delete(Long id) : void"], iface=True)
    jc("X_IncomeServiceImpl", "IncomeServiceImpl", "com.fms.service",
       ["implements IncomeService"],
       ["+ all methods return null / no-op  // TODO"])
    jc("X_ExpenseService", "ExpenseService", "com.fms.service",
       [],
       ["+ getAllByUser(String userEmail) : List&lt;ExpenseDTO&gt;",
        "+ add(String userEmail, ExpenseDTO) : ExpenseDTO",
        "+ update(Long id, ExpenseDTO) : ExpenseDTO",
        "+ delete(Long id) : void"], iface=True)
    jc("X_ExpenseServiceImpl", "ExpenseServiceImpl", "com.fms.service",
       ["implements ExpenseService"],
       ["+ all methods return null / no-op  // TODO"])
    jc("X_DashService", "DashboardService", "com.fms.service",
       [],
       ["+ getSummary(String userEmail) : DashboardSummaryDTO"], iface=True)
    jc("X_DashServiceImpl", "DashboardServiceImpl", "com.fms.service",
       ["implements DashboardService"],
       ["+ getSummary() : DashboardSummaryDTO  // TODO: null"])
    jc("X_TuitionService", "TuitionService", "com.fms.service",
       [],
       ["+ calculate(String userEmail, TuitionRequestDTO)",
        "     : TuitionResultDTO"], iface=True)
    jc("X_TuitionServiceImpl", "TuitionServiceImpl", "com.fms.service",
       ["implements TuitionService"],
       ["+ calculate() : TuitionResultDTO  // TODO: null"])
    jc("X_PredService", "ExpensePredictionService", "com.fms.service",
       [],
       ["+ predictNextMonthExpenses(String userEmail)",
        "     : List&lt;ExpenseDTO&gt;"], iface=True)
    jc("X_PredServiceImpl", "ExpensePredictionServiceImpl", "com.fms.service",
       ["implements ExpensePredictionService"],
       ["+ predictNextMonthExpenses()  // TODO: null"])
    jc("X_SimService", "WhatIfSimulationService", "com.fms.service",
       [],
       ["+ runSimulation(String userEmail, SimulationRequestDTO)",
        "     : SimulationResultDTO"], iface=True)
    jc("X_SimServiceImpl", "WhatIfSimulationServiceImpl", "com.fms.service",
       ["implements WhatIfSimulationService"],
       ["+ runSimulation() : SimulationResultDTO  // TODO: null"])
    jc("X_AIService", "AIAdvisorService", "com.fms.service",
       [],
       ["+ ask(String userEmail, AIQueryDTO) : AIResponseDTO"], iface=True)
    jc("X_AIServiceImpl", "AIAdvisorServiceImpl", "com.fms.service",
       ["implements AIAdvisorService",
        "- openAiApiKey : String  @Value(\"${openai.api.key}\")"],
       ["+ ask() : AIResponseDTO  // TODO: OpenAI call, returns null"])

    # -------- Controllers ----------------------------------------------------
    jc("X_AuthCtrl", "AuthController", "com.fms.controller",
       ["- authService : AuthService  (final)"],
       ["+ register(@Valid RegisterRequest) : ResponseEntity  // null",
        "+ login(@Valid LoginRequest) : ResponseEntity  // null"])
    jc("X_IncomeCtrl", "IncomeController", "com.fms.controller",
       ["- incomeService : IncomeService  (final)"],
       ["+ getAll(@AuthenticationPrincipal) : ResponseEntity  // null",
        "+ add(@AuthenticationPrincipal, @Valid dto) : ResponseEntity  // null",
        "+ update(@PathVariable id, @Valid dto) : ResponseEntity  // null",
        "+ delete(@PathVariable id) : ResponseEntity  // null"])
    jc("X_ExpenseCtrl", "ExpenseController", "com.fms.controller",
       ["- expenseService : ExpenseService  (final)"],
       ["+ getAll(...) // null",
        "+ add(...) // null",
        "+ update(...) // null",
        "+ delete(...) // null"])
    jc("X_DashCtrl", "DashboardController", "com.fms.controller",
       ["- dashboardService : DashboardService  (final)"],
       ["+ getSummary(@AuthenticationPrincipal) : ResponseEntity  // null"])
    jc("X_TuitionCtrl", "TuitionController", "com.fms.controller",
       ["- tuitionService : TuitionService  (final)"],
       ["+ calculate(@AuthenticationPrincipal, @Valid req) : ResponseEntity  // null"])
    jc("X_PredCtrl", "PredictionController", "com.fms.controller",
       ["- expensePredictionService : ExpensePredictionService"],
       ["+ getPrediction(@AuthenticationPrincipal) : ResponseEntity  // null"])
    jc("X_SimCtrl", "SimulationController", "com.fms.controller",
       ["- whatIfSimulationService : WhatIfSimulationService"],
       ["+ run(@AuthenticationPrincipal, @Valid req) : ResponseEntity  // null"])
    jc("X_AICtrl", "AIAdvisorController", "com.fms.controller",
       ["- aiAdvisorService : AIAdvisorService"],
       ["+ ask(@AuthenticationPrincipal, @Valid query) : ResponseEntity  // null"])

    # -------- Config ---------------------------------------------------------
    jc("X_SecCfg", "SecurityConfig", "com.fms.config",
       ["@EnableWebSecurity"],
       ["+ securityFilterChain(HttpSecurity) : SecurityFilterChain",
        "     csrf disabled, sessions STATELESS",
        "     /api/auth/** permitAll, rest authenticated",
        "     // TODO: add JwtAuthenticationFilter",
        "+ passwordEncoder() : PasswordEncoder  (BCrypt)"])
    jc("X_JwtUtil", "JwtUtil", "com.fms.config",
       ["- jwtSecret : String  @Value",
        "- jwtExpirationMs : long  @Value(86400000)"],
       ["+ generateToken(email) : String  // TODO null",
        "+ validateToken(token) : boolean  // TODO false",
        "+ extractEmail(token) : String  // TODO null"])
    jc("X_CorsCfg", "CorsConfig", "com.fms.config",
       [],
       ["+ corsFilter() : CorsFilter",
        "     allow http://localhost:5173"])
    jc("X_FmsApp", "FmsApplication", "com.fms",
       ["@SpringBootApplication"],
       ["+ main(String[] args) : void"])

    # -------- Relationships --------------------------------------------------
    # User composition (filled diamond, back-arrow = 1..* on the composed side)
    for e in ["X_Income", "X_Expense", "X_TuitionPlan"]:
        g.edge("X_User", e, arrowtail="diamond", dir="back",
               headlabel="0..*", taillabel="1", fontsize="9",
               color="#2E7D32")

    # Repos → entities
    for r, e in [("X_UserRepo", "X_User"),
                 ("X_IncomeRepo", "X_Income"),
                 ("X_ExpenseRepo", "X_Expense"),
                 ("X_TuitionRepo", "X_TuitionPlan")]:
        g.edge(r, e, style="dashed", arrowhead="open",
               color="#6A1B9A", label="&lt;&lt;manages&gt;&gt;", fontsize="8")

    # Impl realizes interface (dashed, empty triangle)
    for iface, impl in [
        ("X_AuthService", "X_AuthServiceImpl"),
        ("X_IncomeService", "X_IncomeServiceImpl"),
        ("X_ExpenseService", "X_ExpenseServiceImpl"),
        ("X_DashService", "X_DashServiceImpl"),
        ("X_TuitionService", "X_TuitionServiceImpl"),
        ("X_PredService", "X_PredServiceImpl"),
        ("X_SimService", "X_SimServiceImpl"),
        ("X_AIService", "X_AIServiceImpl"),
    ]:
        g.edge(impl, iface, style="dashed", arrowhead="empty", color="#1565C0")

    # Service impl → repository (dependency)
    for impl, repo in [
        ("X_AuthServiceImpl", "X_UserRepo"),
        ("X_AuthServiceImpl", "X_JwtUtil"),
        ("X_IncomeServiceImpl", "X_IncomeRepo"),
        ("X_IncomeServiceImpl", "X_UserRepo"),
        ("X_ExpenseServiceImpl", "X_ExpenseRepo"),
        ("X_ExpenseServiceImpl", "X_UserRepo"),
        ("X_DashServiceImpl", "X_IncomeRepo"),
        ("X_DashServiceImpl", "X_ExpenseRepo"),
        ("X_DashServiceImpl", "X_UserRepo"),
        ("X_TuitionServiceImpl", "X_TuitionRepo"),
        ("X_PredServiceImpl", "X_ExpenseRepo"),
        ("X_SimServiceImpl", "X_IncomeRepo"),
        ("X_SimServiceImpl", "X_ExpenseRepo"),
    ]:
        g.edge(impl, repo, style="dashed", arrowhead="open", color="#555555")

    # Controllers → service interfaces
    for ctrl, svc in [
        ("X_AuthCtrl", "X_AuthService"),
        ("X_IncomeCtrl", "X_IncomeService"),
        ("X_ExpenseCtrl", "X_ExpenseService"),
        ("X_DashCtrl", "X_DashService"),
        ("X_TuitionCtrl", "X_TuitionService"),
        ("X_PredCtrl", "X_PredService"),
        ("X_SimCtrl", "X_SimService"),
        ("X_AICtrl", "X_AIService"),
    ]:
        g.edge(ctrl, svc, arrowhead="vee", color="#C62828")

    # SecurityConfig → JwtUtil
    g.edge("X_SecCfg", "X_JwtUtil", style="dashed", arrowhead="open",
           color="#E65100")

    # Grid-stack to avoid horizontal blow-up
    grid_stack(g, ["X_User", "X_Income", "X_Expense", "X_TuitionPlan"],
               cols=4, w=40)
    grid_stack(g, ["X_RegisterRequest", "X_LoginRequest", "X_AuthResponse",
                   "X_IncomeDTO", "X_ExpenseDTO", "X_DashSummary",
                   "X_TuitionReq", "X_TuitionRes", "X_SimReq", "X_SimRes",
                   "X_AIQuery", "X_AIResp"], cols=5, w=40)
    grid_stack(g, ["X_UserRepo", "X_IncomeRepo", "X_ExpenseRepo",
                   "X_TuitionRepo"], cols=4, w=40)
    grid_stack(g, ["X_AuthService", "X_IncomeService", "X_ExpenseService",
                   "X_DashService", "X_TuitionService", "X_PredService",
                   "X_SimService", "X_AIService"], cols=4, w=40)
    grid_stack(g, ["X_AuthServiceImpl", "X_IncomeServiceImpl",
                   "X_ExpenseServiceImpl", "X_DashServiceImpl",
                   "X_TuitionServiceImpl", "X_PredServiceImpl",
                   "X_SimServiceImpl", "X_AIServiceImpl"], cols=4, w=40)
    grid_stack(g, ["X_AuthCtrl", "X_IncomeCtrl", "X_ExpenseCtrl",
                   "X_DashCtrl", "X_TuitionCtrl", "X_PredCtrl",
                   "X_SimCtrl", "X_AICtrl"], cols=4, w=40)
    grid_stack(g, ["X_FmsApp", "X_SecCfg", "X_JwtUtil", "X_CorsCfg"],
               cols=4, w=40)

    # Bridge between bands
    for a, b in [("X_TuitionPlan", "X_RegisterRequest"),
                 ("X_AIResp", "X_UserRepo"),
                 ("X_TuitionRepo", "X_AuthService"),
                 ("X_AIService", "X_AuthServiceImpl"),
                 ("X_AIServiceImpl", "X_AuthCtrl"),
                 ("X_AICtrl", "X_FmsApp")]:
        g.edge(a, b, style="invis", weight="500", minlen="2")

    return g


# =============================================================================
# Render
# =============================================================================
if __name__ == "__main__":
    for fmt in ("png", "svg"):
        cls = build_class_diagram()
        cls.format = fmt
        cls.render(filename="ClassDiagram_v2",
                   directory=str(OUT_DIR), cleanup=False)

        mvc = build_mvc()
        mvc.format = fmt
        mvc.render(filename="MVC",
                   directory=str(OUT_DIR), cleanup=False)

        rev = build_reverse_class_diagram()
        rev.format = fmt
        rev.render(filename="ReverseClassDiagram",
                   directory=str(OUT_DIR), cleanup=False)

    print("Done.")
