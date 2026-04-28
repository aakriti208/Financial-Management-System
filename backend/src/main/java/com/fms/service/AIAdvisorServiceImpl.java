package com.fms.service;

import com.fms.config.OpenAIClient;
import com.fms.dto.AIQueryDTO;
import com.fms.dto.AIResponseDTO;
import com.fms.dto.DashboardSummaryDTO;
import com.fms.model.Expense;
import com.fms.model.Income;
import com.fms.model.User;
import com.fms.repository.ExpenseRepository;
import com.fms.repository.IncomeRepository;
import com.fms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AIAdvisorServiceImpl implements AIAdvisorService {

    private final OpenAIClient openAIClient;
    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final DashboardService dashboardService;

    @Value("${grok.model.chat:grok-3-mini}")
    private String chatModel;

    @Override
    public AIResponseDTO ask(String userEmail, AIQueryDTO query) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Fetch recent records for context (no vector search needed)
        List<Expense> relevantExpenses = expenseRepository.findByUserOrderByDateDesc(user).stream()
                .limit(10).toList();
        List<Income> relevantIncomes = incomeRepository.findByUserOrderByDateDesc(user).stream()
                .limit(10).toList();

        // Fetch the user's overall financial summary for grounding context
        DashboardSummaryDTO summary = dashboardService.getSummary(userEmail);

        // 4. Build augmented system prompt
        String systemPrompt = buildSystemPrompt(summary, relevantExpenses, relevantIncomes);

        // 5. Generate answer
        String answer = openAIClient.chat(systemPrompt, query.getQuestion());

        AIResponseDTO response = new AIResponseDTO();
        response.setAnswer(answer);
        response.setModel(chatModel);
        return response;
    }

    private String buildSystemPrompt(DashboardSummaryDTO summary,
                                     List<Expense> expenses,
                                     List<Income> incomes) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are a personal financial advisor for an international student. ");
        sb.append("Answer based only on the user's actual financial data provided below. ");
        sb.append("Be concise, empathetic, and specific. Use dollar amounts when referring to records.\n\n");

        sb.append("=== FINANCIAL SUMMARY ===\n");
        sb.append("Total Income  (all-time): $").append(summary.getTotalIncome()).append("\n");
        sb.append("Total Expenses (all-time): $").append(summary.getTotalExpenses()).append("\n");
        sb.append("Net Balance:              $").append(summary.getNetBalance()).append("\n\n");

        if (!expenses.isEmpty()) {
            sb.append("=== RELEVANT EXPENSE RECORDS ===\n");
            for (Expense e : expenses) {
                sb.append(String.format("- %s: $%s | %s | %s | %s\n",
                        e.getCategory(), e.getAmount(),
                        e.getExpenseType(), e.getNecessity(), e.getDate()));
            }
            sb.append("\n");
        }

        if (!incomes.isEmpty()) {
            sb.append("=== RELEVANT INCOME RECORDS ===\n");
            for (Income i : incomes) {
                sb.append(String.format("- %s: $%s | %s | %s\n",
                        i.getSource(), i.getAmount(), i.getSourceType(), i.getDate()));
            }
        }

        return sb.toString();
    }

}
