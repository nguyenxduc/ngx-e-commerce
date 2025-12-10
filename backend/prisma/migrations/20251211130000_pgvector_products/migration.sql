-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Table to store product embeddings
CREATE TABLE IF NOT EXISTS "product_embeddings" (
    "product_id" BIGINT PRIMARY KEY,
    "content" TEXT,
    "embedding" vector(1536) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "product_embeddings_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Vector index (use cosine distance)
CREATE INDEX IF NOT EXISTS "product_embeddings_embedding_idx"
ON "product_embeddings"
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

