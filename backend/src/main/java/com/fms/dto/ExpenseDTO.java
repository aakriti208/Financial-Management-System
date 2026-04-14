package com.fms.dto;

import com.fms.model.ExpenseType;
import com.fms.model.Necessity;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ExpenseDTO {

    private Long id;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal amount;

    @NotBlank
    private String category;

    @NotNull
    private ExpenseType expenseType;

    @NotNull
    private Necessity necessity;

    @NotNull
    private LocalDate date;

    private String description;
}
