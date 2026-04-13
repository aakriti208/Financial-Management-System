package com.fms.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "tuition_plans", indexes = {
        @Index(name = "idx_tuition_user", columnList = "user_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TuitionPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private User user;

    @NotNull
    @DecimalMin("0.0")
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal tuitionPerCourse;

    @NotNull
    @Column(nullable = false)
    private Integer numberOfCourses;

    @DecimalMin("0.0")
    @Column(precision = 12, scale = 2)
    private BigDecimal scholarshipAmount;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalCost;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    @PreUpdate
    public void calculateTotal() {
        BigDecimal total = tuitionPerCourse.multiply(BigDecimal.valueOf(numberOfCourses));
        if (scholarshipAmount != null) {
            total = total.subtract(scholarshipAmount);
        }
        this.totalCost = total;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}