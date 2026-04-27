package com.fms.service;

import com.fms.dto.TuitionRequestDTO;
import com.fms.dto.TuitionResultDTO;
import com.fms.model.Expense;
import com.fms.model.Income;
import com.fms.model.TuitionPlan;
import com.fms.model.User;
import com.fms.repository.ExpenseRepository;
import com.fms.repository.IncomeRepository;
import com.fms.repository.TuitionPlanRepository;
import com.fms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TuitionServiceImpl implements TuitionService {

    private final UserRepository userRepository;
    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final TuitionPlanRepository tuitionPlanRepository;

    @Override
    public TuitionResultDTO calculate(String userEmail, TuitionRequestDTO request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        BigDecimal tuitionPerCourse = request.getTuitionPerCourse();
        int numberOfCourses = request.getNumberOfCourses();
        BigDecimal scholarship = request.getScholarshipAmount() != null
                ? request.getScholarshipAmount() : BigDecimal.ZERO;

        BigDecimal grossTuition = tuitionPerCourse.multiply(BigDecimal.valueOf(numberOfCourses));
        BigDecimal netTuition = grossTuition.subtract(scholarship).max(BigDecimal.ZERO);

        // Current savings = all-time net balance (income - expenses), floored at 0
        List<Income> allIncome = incomeRepository.findByUserOrderByDateDesc(user);
        List<Expense> allExpenses = expenseRepository.findByUserOrderByDateDesc(user);

        BigDecimal totalIncome = allIncome.stream()
                .map(Income::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalExpenses = allExpenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal currentSavings = totalIncome.subtract(totalExpenses).max(BigDecimal.ZERO);
        BigDecimal monthlySurplus = calculateMonthlySurplus(user);

        // Affordability
        BigDecimal additionalNeeded = netTuition.subtract(currentSavings);
        boolean isAffordable = additionalNeeded.compareTo(BigDecimal.ZERO) <= 0;

        Integer estimatedMonthsToSave = null;
        String affordabilityMessage;

        if (isAffordable) {
            estimatedMonthsToSave = 0;
            affordabilityMessage = "Great news! You can afford this tuition with your current savings.";
        } else if (monthlySurplus.compareTo(BigDecimal.ZERO) <= 0) {
            affordabilityMessage = "Your current expenses exceed your income. Consider reducing expenses to start saving.";
        } else {
            estimatedMonthsToSave = additionalNeeded
                    .divide(monthlySurplus, 0, RoundingMode.CEILING).intValue();
            affordabilityMessage = String.format(
                    "You need $%.2f more. At your current savings rate, you can reach this goal in %d month%s.",
                    additionalNeeded.doubleValue(),
                    estimatedMonthsToSave,
                    estimatedMonthsToSave == 1 ? "" : "s"
            );
        }

        // Save the plan
        TuitionPlan plan = new TuitionPlan();
        plan.setUser(user);
        plan.setTuitionPerCourse(tuitionPerCourse);
        plan.setNumberOfCourses(numberOfCourses);
        plan.setScholarshipAmount(scholarship);
        tuitionPlanRepository.save(plan);

        TuitionResultDTO result = new TuitionResultDTO();
        result.setTuitionPerCourse(tuitionPerCourse);
        result.setNumberOfCourses(numberOfCourses);
        result.setScholarshipAmount(scholarship);
        result.setTotalTuition(grossTuition);
        result.setRemainingCost(netTuition);
        result.setCurrentSavings(currentSavings);
        result.setMonthlySurplus(monthlySurplus);
        result.setIsAffordable(isAffordable);
        result.setEstimatedMonthsToSave(estimatedMonthsToSave);
        result.setAffordabilityMessage(affordabilityMessage);
        return result;
    }

    private BigDecimal calculateMonthlySurplus(User user) {
        LocalDate today = LocalDate.now();
        BigDecimal totalNet = BigDecimal.ZERO;
        int months = 6;

        for (int i = 0; i < months; i++) {
            LocalDate month = today.minusMonths(i);
            LocalDate start = month.withDayOfMonth(1);
            LocalDate end = month.withDayOfMonth(month.lengthOfMonth());

            List<Income> incomes = incomeRepository.findByUserAndDateBetween(user, start, end);
            List<Expense> expenses = expenseRepository.findByUserAndDateBetween(user, start, end);

            BigDecimal monthIncome = incomes.stream()
                    .map(Income::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal monthExpenses = expenses.stream()
                    .map(Expense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

            totalNet = totalNet.add(monthIncome.subtract(monthExpenses));
        }

        return totalNet.divide(BigDecimal.valueOf(months), 2, RoundingMode.HALF_UP).max(BigDecimal.ZERO);
    }
}
