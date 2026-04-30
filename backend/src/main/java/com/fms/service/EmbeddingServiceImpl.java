package com.fms.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmbeddingServiceImpl implements EmbeddingService {

    private static final Logger log = LoggerFactory.getLogger(EmbeddingServiceImpl.class);

    @Override
    @Async
    public void embedExpenseAsync(Long expenseId, String text) {
        log.debug("Embedding skipped for expense {} (no embedding model configured)", expenseId);
    }

    @Override
    @Async
    public void embedIncomeAsync(Long incomeId, String text) {
        log.debug("Embedding skipped for income {} (no embedding model configured)", incomeId);
    }
}
