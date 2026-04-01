package com.fms.service;

import com.fms.dto.DashboardSummaryDTO;

public interface DashboardService {

    DashboardSummaryDTO getSummary(String userEmail);
}
