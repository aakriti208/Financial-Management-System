package com.fms.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class SimulationRequestDTO {

    @NotNull
    private BigDecimal hypotheticalMonthlyIncome;

    @NotNull
    private BigDecimal hypotheticalMonthlyExpenses;

    @NotNull
    @Min(1)
    @Max(120)
    private Integer projectionMonths;

    // TODO: Add more what-if parameters, e.g. oneTimeEvents, interestRate, savingsGoal
}
