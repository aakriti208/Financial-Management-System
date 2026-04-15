package com.fms.service;

import com.fms.dto.*;
import com.fms.model.Expense;
import com.fms.model.Income;
import com.fms.model.User;
import com.fms.repository.ExpenseRepository;
import com.fms.repository.IncomeRepository;
import com.fms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;

    @Override
    public DashboardSummaryDTO getSummary(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Income> allIncome = incomeRepository.findByUserOrderByDateDesc(user);
        List<Expense> allExpenses = expenseRepository.findByUserOrderByDateDesc(user);

        BigDecimal totalIncome = allIncome.stream()
                .map(Income::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpenses = allExpenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal netBalance = totalIncome.subtract(totalExpenses);

        List<IncomeDTO> recentIncome = allIncome.stream()
                .limit(5).map(this::toIncomeDTO).collect(Collectors.toList());

        List<ExpenseDTO> recentExpenses = allExpenses.stream()
                .limit(5).map(this::toExpenseDTO).collect(Collectors.toList());

        List<MonthlyDataDTO> monthlyData = buildMonthlyData(user);

        DashboardSummaryDTO dto = new DashboardSummaryDTO();
        dto.setTotalIncome(totalIncome);
        dto.setTotalExpenses(totalExpenses);
        dto.setNetBalance(netBalance);
        dto.setRecentIncome(recentIncome);
        dto.setRecentExpenses(recentExpenses);
        dto.setMonthlyData(monthlyData);
        return dto;
    }

    private List<MonthlyDataDTO> buildMonthlyData(User user) {
        List<MonthlyDataDTO> result = new ArrayList<>();
        DateTimeFormatter labelFmt = DateTimeFormatter.ofPattern("MMM");
        LocalDate today = LocalDate.now();

        for (int i = 5; i >= 0; i--) {
            LocalDate month = today.minusMonths(i);
            LocalDate start = month.withDayOfMonth(1);
            LocalDate end = month.withDayOfMonth(month.lengthOfMonth());

            List<Income> incomes = incomeRepository.findByUserAndDateBetween(user, start, end);
            List<Expense> expenses = expenseRepository.findByUserAndDateBetween(user, start, end);

            BigDecimal monthIncome = incomes.stream()
                    .map(Income::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal monthExpenses = expenses.stream()
                    .map(Expense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

            result.add(new MonthlyDataDTO(month.format(labelFmt), monthIncome, monthExpenses));
        }
        return result;
    }

    private IncomeDTO toIncomeDTO(Income income) {
        IncomeDTO dto = new IncomeDTO();
        dto.setId(income.getId());
        dto.setAmount(income.getAmount());
        dto.setSource(income.getSource());
        dto.setSourceType(income.getSourceType());
        dto.setDate(income.getDate());
        dto.setDescription(income.getDescription());
        return dto;
    }

    private ExpenseDTO toExpenseDTO(Expense expense) {
        ExpenseDTO dto = new ExpenseDTO();
        dto.setId(expense.getId());
        dto.setAmount(expense.getAmount());
        dto.setCategory(expense.getCategory());
        dto.setExpenseType(expense.getExpenseType());
        dto.setNecessity(expense.getNecessity());
        dto.setDate(expense.getDate());
        dto.setDescription(expense.getDescription());
        return dto;
    }
}
