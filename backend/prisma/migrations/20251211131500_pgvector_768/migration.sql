-- Adjust product_embeddings vector dimension to 768 for Gemini text-embedding-004
-- Drop existing index (if any) because of type change
DROP INDEX IF EXISTS "product_embeddings_embedding_idx";

-- Alter column to vector(768)
ALTER TABLE "product_embeddings"
  ALTER COLUMN "embedding" TYPE vector(768);

-- Recreate IVFFLAT index with cosine distance
CREATE INDEX IF NOT EXISTS "product_embeddings_embedding_idx"
ON "product_embeddings"
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

