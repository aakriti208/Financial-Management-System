package com.fms.service;

import com.fms.dto.ExpenseDTO;
import com.fms.model.Expense;
import com.fms.model.ExpenseType;
import com.fms.model.Necessity;
import com.fms.model.User;
import com.fms.repository.ExpenseRepository;
import com.fms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpensePredictionServiceImpl implements ExpensePredictionService {

    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;

    @Override
    public List<ExpenseDTO> predictNextMonthExpenses(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Look back up to 6 months, including the current month
        LocalDate today = LocalDate.now();
        LocalDate start = today.minusMonths(6).withDayOfMonth(1);
        LocalDate end = today;

        List<Expense> expenses = expenseRepository.findByUserAndDateBetween(user, start, end);
        if (expenses.isEmpty()) {
            return Collections.emptyList();
        }

        // Group by category
        Map<String, List<Expense>> byCategory = expenses.stream()
                .collect(Collectors.groupingBy(Expense::getCategory));

        LocalDate nextMonthDate = today.plusMonths(1).withDayOfMonth(1);

        List<ExpenseDTO> predictions = new ArrayList<>();
        for (Map.Entry<String, List<Expense>> entry : byCategory.entrySet()) {
            String category = entry.getKey();
            List<Expense> categoryExpenses = entry.getValue();

            // Number of distinct months this category appeared in
            long distinctMonths = categoryExpenses.stream()
                    .map(e -> e.getDate().withDayOfMonth(1))
                    .distinct()
                    .count();

            // Moving average: total / number of months it appeared
            BigDecimal total = categoryExpenses.stream()
                    .map(Expense::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal avgAmount = total.divide(BigDecimal.valueOf(distinctMonths), 2, RoundingMode.HALF_UP);

            // Most common expense type for this category
            ExpenseType expenseType = categoryExpenses.stream()
                    .collect(Collectors.groupingBy(Expense::getExpenseType, Collectors.counting()))
                    .entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .map(Map.Entry::getKey)
                    .orElse(ExpenseType.VARIABLE);

            // Most common necessity for this category
            Necessity necessity = categoryExpenses.stream()
                    .collect(Collectors.groupingBy(Expense::getNecessity, Collectors.counting()))
                    .entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .map(Map.Entry::getKey)
                    .orElse(Necessity.DISCRETIONARY);

            ExpenseDTO dto = new ExpenseDTO();
            dto.setAmount(avgAmount);
            dto.setCategory(category);
            dto.setExpenseType(expenseType);
            dto.setNecessity(necessity);
            dto.setDate(nextMonthDate);
            dto.setDescription("Predicted from " + distinctMonths + "-month average");
            predictions.add(dto);
        }

        // Sort by predicted amount descending
        predictions.sort((a, b) -> b.getAmount().compareTo(a.getAmount()));
        return predictions;
    }
}
