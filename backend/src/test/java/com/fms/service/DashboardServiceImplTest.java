package com.fms.service;

import com.fms.dto.DashboardSummaryDTO;
import com.fms.model.*;
import com.fms.repository.ExpenseRepository;
import com.fms.repository.IncomeRepository;
import com.fms.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceImplTest {

    @Mock UserRepository userRepository;
    @Mock IncomeRepository incomeRepository;
    @Mock ExpenseRepository expenseRepository;

    @InjectMocks DashboardServiceImpl dashboardService;

    private User user;
    private Income income1, income2;
    private Expense expense1;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("jane@university.edu");

        income1 = buildIncome(1L, "1500.00", 5);
        income2 = buildIncome(2L, "500.00", 10);

        expense1 = buildExpense(1L, "800.00", 3);
    }

    // ── getSummary totals ─────────────────────────────────────────────────────

    @Test
    void getSummary_calculatesTotalsCorrectly() {
        stubRepositories(List.of(income1, income2), List.of(expense1));

        DashboardSummaryDTO result = dashboardService.getSummary("jane@university.edu");

        assertThat(result.getTotalIncome()).isEqualByComparingTo("2000.00");
        assertThat(result.getTotalExpenses()).isEqualByComparingTo("800.00");
        assertThat(result.getNetBalance()).isEqualByComparingTo("1200.00");
    }

    @Test
    void getSummary_returnsZeroTotalsWhenNoData() {
        stubRepositories(List.of(), List.of());

        DashboardSummaryDTO result = dashboardService.getSummary("jane@university.edu");

        assertThat(result.getTotalIncome()).isEqualByComparingTo("0.00");
        assertThat(result.getTotalExpenses()).isEqualByComparingTo("0.00");
        assertThat(result.getNetBalance()).isEqualByComparingTo("0.00");
    }

    @Test
    void getSummary_netBalanceIsNegativeWhenExpensesExceedIncome() {
        Income smallIncome = buildIncome(3L, "100.00", 2);
        stubRepositories(List.of(smallIncome), List.of(expense1));

        DashboardSummaryDTO result = dashboardService.getSummary("jane@university.edu");

        assertThat(result.getNetBalance()).isNegative();
        assertThat(result.getNetBalance()).isEqualByComparingTo("-700.00");
    }

    // ── recent items ──────────────────────────────────────────────────────────

    @Test
    void getSummary_limitsRecentIncomeToFive() {
        List<Income> sixIncomes = List.of(
                buildIncome(1L, "100", 1), buildIncome(2L, "100", 2),
                buildIncome(3L, "100", 3), buildIncome(4L, "100", 4),
                buildIncome(5L, "100", 5), buildIncome(6L, "100", 6)
        );
        stubRepositories(sixIncomes, List.of());

        DashboardSummaryDTO result = dashboardService.getSummary("jane@university.edu");

        assertThat(result.getRecentIncome()).hasSize(5);
    }

    @Test
    void getSummary_limitsRecentExpensesToFive() {
        List<Expense> sixExpenses = List.of(
                buildExpense(1L, "50", 1), buildExpense(2L, "50", 2),
                buildExpense(3L, "50", 3), buildExpense(4L, "50", 4),
                buildExpense(5L, "50", 5), buildExpense(6L, "50", 6)
        );
        stubRepositories(List.of(), sixExpenses);

        DashboardSummaryDTO result = dashboardService.getSummary("jane@university.edu");

        assertThat(result.getRecentExpenses()).hasSize(5);
    }

    // ── monthly data ──────────────────────────────────────────────────────────

    @Test
    void getSummary_returnsExactlySixMonthlyDataPoints() {
        stubRepositories(List.of(), List.of());

        DashboardSummaryDTO result = dashboardService.getSummary("jane@university.edu");

        assertThat(result.getMonthlyData()).hasSize(6);
    }

    @Test
    void getSummary_monthlyLabelsAreThreeLetterAbbreviations() {
        stubRepositories(List.of(), List.of());

        DashboardSummaryDTO result = dashboardService.getSummary("jane@university.edu");

        result.getMonthlyData().forEach(m ->
                assertThat(m.getMonth()).matches("[A-Z][a-z]{2}")
        );
    }

    // ── error handling ────────────────────────────────────────────────────────

    @Test
    void getSummary_throwsWhenUserNotFound() {
        when(userRepository.findByEmail("unknown@test.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> dashboardService.getSummary("unknown@test.com"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("User not found");
    }

    // ── helpers ───────────────────────────────────────────────────────────────

    private void stubRepositories(List<Income> incomes, List<Expense> expenses) {
        when(userRepository.findByEmail("jane@university.edu")).thenReturn(Optional.of(user));
        when(incomeRepository.findByUserOrderByDateDesc(user)).thenReturn(incomes);
        when(expenseRepository.findByUserOrderByDateDesc(user)).thenReturn(expenses);
        when(incomeRepository.findByUserAndDateBetween(eq(user), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(List.of());
        when(expenseRepository.findByUserAndDateBetween(eq(user), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(List.of());
    }

    private Income buildIncome(Long id, String amount, int daysAgo) {
        Income i = new Income();
        i.setId(id);
        i.setUser(user);
        i.setAmount(new BigDecimal(amount));
        i.setSource("Source " + id);
        i.setSourceType(IncomeSourceType.OTHER);
        i.setDate(LocalDate.now().minusDays(daysAgo));
        return i;
    }

    private Expense buildExpense(Long id, String amount, int daysAgo) {
        Expense e = new Expense();
        e.setId(id);
        e.setUser(user);
        e.setAmount(new BigDecimal(amount));
        e.setCategory("Category " + id);
        e.setExpenseType(ExpenseType.VARIABLE);
        e.setNecessity(Necessity.DISCRETIONARY);
        e.setDate(LocalDate.now().minusDays(daysAgo));
        return e;
    }
}
