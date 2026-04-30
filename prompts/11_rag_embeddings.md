# Prompt 11 — RAG Infrastructure (Vector Embeddings)
**Phase:** AI Enhancement

---

## Context
The basic AI advisor is working but it just passes the 10 most recent records regardless of what the user asked. Looking into RAG (Retrieval-Augmented Generation) to make retrieval smarter — embed each expense/income as a vector when saved, then on each question find the semantically closest records instead of just the most recent ones. Need pgvector in PostgreSQL for the similarity search.

---

## Prompt

```
Add RAG (Retrieval-Augmented Generation) infrastructure to the FMS backend.
The goal: embed expenses and incomes as vectors when saved, then retrieve the most
semantically relevant records for each AI query using cosine similarity.

Database: PostgreSQL 15 with pgvector extension.
Embedding model: OpenAI text-embedding-3-small (1536 dimensions).

---

### schema.sql (src/main/resources/)
-- Run AFTER Hibernate DDL (set spring.jpa.defer-datasource-initialization=true)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS expense_embeddings (
    expense_id BIGINT PRIMARY KEY REFERENCES expenses(id) ON DELETE CASCADE,
    embedding  vector(1536)
);

CREATE TABLE IF NOT EXISTS income_embeddings (
    income_id BIGINT PRIMARY KEY REFERENCES income(id) ON DELETE CASCADE,
    embedding vector(1536)
);

Add to application.properties:
spring.jpa.defer-datasource-initialization=true
spring.sql.init.mode=always
spring.sql.init.continue-on-error=true

---

### com.fms.config.OpenAIClient — add embed() method
float[] embed(String text):
  - POST https://api.openai.com/v1/embeddings
  - Body: { "model": embeddingModel, "input": text }
  - Parse: data[0].embedding -> float[]
  - On exception: throw RuntimeException("Embedding request failed: ...")

Add @Value("${openai.model.embedding:text-embedding-3-small}") String embeddingModel

---

### com.fms.repository.VectorRepository (@Repository)
Use JdbcTemplate (NOT JPA) to avoid Hibernate custom-type complexity.

saveExpenseEmbedding(Long expenseId, float[] embedding):
  INSERT INTO expense_embeddings ... ON CONFLICT DO UPDATE SET embedding = CAST(? AS vector)
  Convert float[] to "[1.0,2.0,...]" string for PostgreSQL vector literal

saveIncomeEmbedding(Long incomeId, float[] embedding): same pattern

---

### com.fms.service.EmbeddingService (interface + impl)
Both methods are @Async (add @EnableAsync via AsyncConfig).
Silently log.warn on failure — never throw, never block the main thread.

embedExpenseAsync(Long expenseId, String text)
embedIncomeAsync(Long incomeId, String text)

text format for expense: "{category} {expenseType} {necessity} {description}"
text format for income:  "{source} {sourceType} {description}"

---

### Hook into ExpenseServiceImpl and IncomeServiceImpl
After save, call embeddingService.embedExpenseAsync(saved.getId(), buildText(saved))
This is fire-and-forget — the main save should not wait for it.

---

### Update ExpenseRepository and IncomeRepository — add vector search queries
@Query(nativeQuery=true)
List<Expense> findTopKSimilar(@Param("userId") Long userId,
                              @Param("queryVector") String queryVector,
                              @Param("limit") int limit)

SQL: SELECT e.* FROM expenses e
     JOIN expense_embeddings ee ON e.id = ee.expense_id
     WHERE e.user_id = :userId
     ORDER BY ee.embedding <=> CAST(:queryVector AS vector)
     LIMIT :limit

Same for IncomeRepository.

---

### Update AIAdvisorServiceImpl to use vector search
Replace "10 most recent" fetch with:
  float[] questionEmbedding = openAIClient.embed(query.getQuestion())
  String vectorStr = "[" + join(",", questionEmbedding) + "]"
  relevantExpenses = expenseRepository.findTopKSimilar(user.getId(), vectorStr, 5)
  relevantIncomes  = incomeRepository.findTopKSimilar(user.getId(), vectorStr, 5)

NOTE: This requires pgvector to be installed on the PostgreSQL instance.
If pgvector is not available, schema.sql will fail — set continue-on-error=true
so the app still starts and falls back gracefully.
```
