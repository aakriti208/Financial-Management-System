"""Render a MINIMAL MVC architecture diagram for FMS \u2014 presentation-friendly.

Designed to be projected on a slide: four boxes in a horizontal flow, each with
a coloured header and a small bulleted summary of what lives in that layer.
A thick request arrow flows left \u2192 right, a return arrow flows right \u2192 left.

Output: docs/diagrams/MVC_Minimal.png  +  .svg
"""
from pathlib import Path
from graphviz import Digraph

OUT_DIR = Path("/sessions/zealous-nice-faraday/mnt/Financial-Management-System/docs/diagrams")
OUT_DIR.mkdir(parents=True, exist_ok=True)


# ---------------------------------------------------------------------------
# Layer-card builder \u2014 a single rectangular node with a coloured header
# strip and a small bulleted body below.
# ---------------------------------------------------------------------------
def card(title, subtitle, items, header="#1F4E79", body="#F4F8FB"):
    parts = [
        f'<TABLE BORDER="0" CELLBORDER="0" CELLSPACING="0" '
        f'CELLPADDING="8" BGCOLOR="{body}">'
    ]
    # header strip
    parts.append(
        f'<TR><TD BGCOLOR="{header}" CELLPADDING="10" ALIGN="CENTER">'
        f'<FONT COLOR="#FFFFFF" POINT-SIZE="16"><B>{title}</B></FONT><BR/>'
        f'<FONT COLOR="#DDEEFF" POINT-SIZE="11"><I>{subtitle}</I></FONT>'
        f'</TD></TR>'
    )
    # body bullets
    body_rows = "".join(
        f'<TR><TD ALIGN="LEFT" CELLPADDING="3">'
        f'<FONT POINT-SIZE="12" COLOR="#1F4E79">\u2022 </FONT>'
        f'<FONT POINT-SIZE="12">{item}</FONT></TD></TR>'
        for item in items
    )
    parts.append(body_rows)
    parts.append('</TABLE>')
    return "<" + "".join(parts) + ">"


def db_cylinder():
    """A PostgreSQL cylinder, drawn with HTML so it matches the card width."""
    return (
        '<<TABLE BORDER="0" CELLBORDER="0" CELLSPACING="0" CELLPADDING="10">'
        '<TR><TD BGCOLOR="#336791" CELLPADDING="14" ALIGN="CENTER">'
        '<FONT COLOR="#FFFFFF" POINT-SIZE="16"><B>PostgreSQL</B></FONT><BR/>'
        '<FONT COLOR="#CFE2F3" POINT-SIZE="11"><I>fms_db</I></FONT>'
        '</TD></TR>'
        '<TR><TD ALIGN="CENTER" CELLPADDING="3">'
        '<FONT POINT-SIZE="11" COLOR="#444444">users \u00b7 income \u00b7 expenses<BR/>tuition_plans</FONT>'
        '</TD></TR>'
        '</TABLE>>'
    )


def actor():
    """Simple user actor box — head + shoulders drawn with text shapes
    (Graphviz default fonts lack emoji glyphs)."""
    return (
        '<<TABLE BORDER="0" CELLBORDER="0" CELLSPACING="0" CELLPADDING="2">'
        # head: a circle made from a bullet character
        '<TR><TD ALIGN="CENTER"><FONT POINT-SIZE="34" COLOR="#1F4E79">'
        '&#9679;</FONT></TD></TR>'
        # shoulders: a rounded arc using a Unicode upper half-circle
        '<TR><TD ALIGN="CENTER"><FONT POINT-SIZE="34" COLOR="#1F4E79">'
        '&#9650;</FONT></TD></TR>'
        '<TR><TD ALIGN="CENTER"><FONT POINT-SIZE="14"><B>User</B></FONT></TD></TR>'
        '<TR><TD ALIGN="CENTER"><FONT POINT-SIZE="10" COLOR="#666666">'
        '(browser)</FONT></TD></TR>'
        '</TABLE>>'
    )


# ---------------------------------------------------------------------------
# Build the diagram
# ---------------------------------------------------------------------------
def build():
    g = Digraph(format="png")
    g.attr(rankdir="LR",
           splines="spline",
           nodesep="0.6",
           ranksep="1.0",
           fontname="Helvetica",
           fontsize="20",
           dpi="180",
           label="FMS \u2014 MVC Architecture",
           labelloc="t",
           pad="0.4")
    g.attr("node", shape="plaintext", fontname="Helvetica")
    g.attr("edge", fontname="Helvetica-Bold", fontsize="11", color="#1F4E79",
           fontcolor="#1F4E79", penwidth="2.0", arrowsize="1.0")

    # ----- nodes -----
    g.node("user", actor())

    g.node("view", card(
        title="VIEW",
        subtitle="React 18 + Vite (frontend)",
        items=[
            "9 Pages (Login, Dashboard, Income\u2026)",
            "Components (Forms, Charts, Cards)",
            "AuthContext (JWT + user state)",
            "Axios client (Bearer token)",
        ],
        header="#2E7D32", body="#F1F8F2",
    ))

    g.node("ctrl", card(
        title="CONTROLLER",
        subtitle="Spring MVC REST (Java 17)",
        items=[
            "8 @RestControllers (/api/*)",
            "JWT Authentication Filter",
            "Bean Validation (@Valid)",
            "DTO \u2194 JSON marshalling",
        ],
        header="#1F4E79", body="#F4F8FB",
    ))

    g.node("model", card(
        title="MODEL",
        subtitle="Service + JPA (business + data)",
        items=[
            "8 Service interfaces + Impls",
            "4 Entities (User, Income, Expense, TuitionPlan)",
            "4 Spring Data JPA Repositories",
            "Algorithms: BCrypt, JWT, simulation, AI",
        ],
        header="#6A1B9A", body="#F8F2FB",
    ))

    g.node("db", db_cylinder())

    # ----- request flow (left \u2192 right) -----
    g.edge("user", "view",  label="  uses (HTTPS)  ")
    g.edge("view", "ctrl",  label="  HTTP / JSON  ")
    g.edge("ctrl", "model", label="  invokes  ")
    g.edge("model", "db",   label="  JPA / SQL  ")

    # ----- return path (right \u2192 left, dashed lighter) -----
    g.attr("edge", color="#888888", fontcolor="#888888",
           style="dashed", penwidth="1.4", arrowsize="0.8",
           fontsize="10")
    g.edge("db", "model",   label="  ResultSet  ", constraint="false")
    g.edge("model", "ctrl", label="  DTO  ",       constraint="false")
    g.edge("ctrl", "view",  label="  JSON  ",      constraint="false")
    g.edge("view", "user",  label="  rendered UI  ", constraint="false")

    out = OUT_DIR / "MVC_Minimal"
    g.render(str(out), format="png", cleanup=False)
    g.format = "svg"
    g.render(str(out), format="svg", cleanup=False)
    print(f"  [ok] {out}.png  /  .svg")


if __name__ == "__main__":
    build()
