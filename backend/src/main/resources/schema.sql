-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Embedding table for expenses (separate from main entity to avoid JPA type mapping issues)
CREATE TABLE IF NOT EXISTS expense_embeddings (
    expense_id BIGINT PRIMARY KEY REFERENCES expenses(id) ON DELETE CASCADE,
    embedding   vector(1536)
);

-- Embedding table for income records
CREATE TABLE IF NOT EXISTS income_embeddings (
    income_id BIGINT PRIMARY KEY REFERENCES income(id) ON DELETE CASCADE,
    embedding  vector(1536)
);
