package com.fms.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class DashboardSummaryDTO {

    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal netBalance;
    private List<IncomeDTO> recentIncome;
    private List<ExpenseDTO> recentExpenses;
    // TODO: Add monthly breakdown list, category totals, budget alerts
}
