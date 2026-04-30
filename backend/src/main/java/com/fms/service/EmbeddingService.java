package com.fms.service;

public interface EmbeddingService {
    void embedExpenseAsync(Long expenseId, String text);
    void embedIncomeAsync(Long incomeId, String text);
}
