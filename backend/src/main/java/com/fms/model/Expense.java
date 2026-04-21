package com.fms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * JPA entity representing a single expense record belonging to a {@link User}.
 *
 * <p>Expenses are classified along two orthogonal axes:
 * <ul>
 *   <li>{@link ExpenseType} — whether the amount is {@code FIXED} or {@code VARIABLE}</li>
 *   <li>{@link Necessity} — whether it is {@code ESSENTIAL} or {@code DISCRETIONARY}</li>
 * </ul>
 * These classifications power the budget-analysis and expense-prediction features.</p>
 */
@Entity
@Table(name = "expenses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Expense {

    /** Auto-generated primary key. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The user who owns this expense record (lazily loaded). */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** Monetary amount of this expense entry (precision 12, scale 2). */
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    /** Spending category label (e.g. "Tuition", "Groceries", "Rent"). */
    @Column(nullable = false)
    private String category;

    /** Whether the expense amount is fixed or variable month-to-month. */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExpenseType expenseType;

    /** Whether the expense is essential (need) or discretionary (want). */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Necessity necessity;

    /** The date on which the expense was incurred. */
    @Column(nullable = false)
    private LocalDate date;

    /** Optional free-text note about this expense entry. */
    private String description;
}
