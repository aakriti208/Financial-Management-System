package com.fms.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

/**
 * Handles low-level vector persistence using JdbcTemplate with explicit CAST to pgvector type.
 * Kept separate from JPA repositories to avoid Hibernate custom-type complexity.
 */
@Repository
@RequiredArgsConstructor
public class VectorRepository {

    private final JdbcTemplate jdbcTemplate;

    public void saveExpenseEmbedding(Long expenseId, float[] embedding) {
        String vectorStr = toVectorString(embedding);
        jdbcTemplate.update("""
                INSERT INTO expense_embeddings (expense_id, embedding)
                VALUES (?, CAST(? AS vector))
                ON CONFLICT (expense_id) DO UPDATE SET embedding = CAST(? AS vector)
                """, expenseId, vectorStr, vectorStr);
    }

    public void saveIncomeEmbedding(Long incomeId, float[] embedding) {
        String vectorStr = toVectorString(embedding);
        jdbcTemplate.update("""
                INSERT INTO income_embeddings (income_id, embedding)
                VALUES (?, CAST(? AS vector))
                ON CONFLICT (income_id) DO UPDATE SET embedding = CAST(? AS vector)
                """, incomeId, vectorStr, vectorStr);
    }

    private String toVectorString(float[] vector) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < vector.length; i++) {
            if (i > 0) sb.append(",");
            sb.append(vector[i]);
        }
        sb.append("]");
        return sb.toString();
    }
}
