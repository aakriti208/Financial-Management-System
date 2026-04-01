package com.fms.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class SimulationResultDTO {

    private BigDecimal projectedFinalBalance;
    private BigDecimal projectedTotalSavings;
    private List<BigDecimal> monthlyBalances;
    // TODO: Add scenario name, comparison with current trajectory, chart-ready data points
}
