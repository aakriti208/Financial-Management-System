package com.fms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * JPA entity representing a single income record belonging to a {@link User}.
 *
 * <p>Income records capture the amount, source label, source type classification
 * (e.g. {@link IncomeSourceType#SCHOLARSHIP}), date, and an optional free-text
 * description. The {@code user} relationship is loaded lazily to avoid N+1
 * queries when fetching large result sets.</p>
 */
@Entity
@Table(name = "income")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Income {

    /** Auto-generated primary key. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The user who owns this income record (lazily loaded). */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** Monetary amount of this income entry (precision 12, scale 2). */
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    /** Human-readable label for the income source (e.g. "NSF Fellowship"). */
    @Column(nullable = false)
    private String source;

    /** Categorical classification of the income source. */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncomeSourceType sourceType;

    /** The date on which the income was received. */
    @Column(nullable = false)
    private LocalDate date;

    /** Optional free-text note about this income entry. */
    private String description;
}
