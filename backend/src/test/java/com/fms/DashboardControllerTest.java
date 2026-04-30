package com.fms;

import com.fms.controller.DashboardController;

import com.fms.dto.DashboardSummaryDTO;
import com.fms.dto.MonthlyDataDTO;
import com.fms.service.DashboardService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DashboardController.class)
class DashboardControllerTest {

    @Autowired MockMvc mockMvc;

    @MockBean DashboardService dashboardService;

    private static final String EMAIL = "jane@university.edu";
    private UsernamePasswordAuthenticationToken auth;
    private DashboardSummaryDTO sampleSummary;

    @BeforeEach
    void setUp() {
        auth = new UsernamePasswordAuthenticationToken(EMAIL, null, Collections.emptyList());

        MonthlyDataDTO jan = new MonthlyDataDTO("Jan", new BigDecimal("2000.00"), new BigDecimal("1200.00"));

        sampleSummary = new DashboardSummaryDTO();
        sampleSummary.setTotalIncome(new BigDecimal("2000.00"));
        sampleSummary.setTotalExpenses(new BigDecimal("1200.00"));
        sampleSummary.setNetBalance(new BigDecimal("800.00"));
        sampleSummary.setRecentIncome(List.of());
        sampleSummary.setRecentExpenses(List.of());
        sampleSummary.setMonthlyData(List.of(jan));
    }

    // ── GET /summary ──────────────────────────────────────────────────────────

    @Test
    void getSummary_returnsOkWithTotals() throws Exception {
        when(dashboardService.getSummary(EMAIL)).thenReturn(sampleSummary);

        mockMvc.perform(get("/api/dashboard/summary").with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalIncome").value(2000.00))
                .andExpect(jsonPath("$.totalExpenses").value(1200.00))
                .andExpect(jsonPath("$.netBalance").value(800.00));
    }

    @Test
    void getSummary_includesMonthlyDataInResponse() throws Exception {
        when(dashboardService.getSummary(EMAIL)).thenReturn(sampleSummary);

        mockMvc.perform(get("/api/dashboard/summary").with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.monthlyData.length()").value(1))
                .andExpect(jsonPath("$.monthlyData[0].month").value("Jan"))
                .andExpect(jsonPath("$.monthlyData[0].income").value(2000.00))
                .andExpect(jsonPath("$.monthlyData[0].expenses").value(1200.00));
    }

    @Test
    void getSummary_returnsEmptyListsWhenNoRecentActivity() throws Exception {
        DashboardSummaryDTO empty = new DashboardSummaryDTO();
        empty.setTotalIncome(BigDecimal.ZERO);
        empty.setTotalExpenses(BigDecimal.ZERO);
        empty.setNetBalance(BigDecimal.ZERO);
        empty.setRecentIncome(List.of());
        empty.setRecentExpenses(List.of());
        empty.setMonthlyData(List.of());

        when(dashboardService.getSummary(EMAIL)).thenReturn(empty);

        mockMvc.perform(get("/api/dashboard/summary").with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.recentIncome.length()").value(0))
                .andExpect(jsonPath("$.recentExpenses.length()").value(0));
    }

    @Test
    void getSummary_returns401WhenNotAuthenticated() throws Exception {
        mockMvc.perform(get("/api/dashboard/summary"))
                .andExpect(status().isUnauthorized());
    }
}
