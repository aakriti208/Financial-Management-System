package com.fms.service;

import com.fms.dto.DashboardSummaryDTO;
import org.springframework.stereotype.Service;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Override
    public DashboardSummaryDTO getSummary(String userEmail) {
        // TODO: Fetch User by email
        // TODO: Sum all income amounts for the user (total income)
        // TODO: Sum all expense amounts for the user (total expenses)
        // TODO: Calculate net balance = totalIncome - totalExpenses
        // TODO: Fetch 5 most recent expenses and 5 most recent income entries
        // TODO: Populate and return DashboardSummaryDTO
        return null;
    }
}
