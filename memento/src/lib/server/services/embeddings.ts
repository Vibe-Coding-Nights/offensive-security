import OpenAI from 'openai';

/**
 * Embeddings Service
 * Generates vector embeddings for semantic search using OpenAI
 */

// Lazy-initialized OpenAI client
let openai: OpenAI | null = null;

// Constants
const EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_DIMENSIONS = 1536;
const MOCK_MODE = process.env.NODE_ENV === 'development' && !process.env.OPENAI_API_KEY;

function getOpenAI(): OpenAI {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }
    openai = new OpenAI({ apiKey });
  }
  return openai;
}

/**
 * Generate embedding for text using OpenAI
 * Returns a 1536-dimensional vector
 */
export async function embed(text: string): Promise<number[]> {
  // Use mock in development without OpenAI key
  if (MOCK_MODE) {
    console.warn('Using mock embeddings - configure OPENAI_API_KEY for production');
    return createMockEmbedding(text);
  }

  try {
    const response = await getOpenAI().embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Failed to generate embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}

/**
 * Batch embed multiple texts
 * More efficient for processing multiple documents
 */
export async function embedBatch(texts: string[]): Promise<number[][]> {
  if (MOCK_MODE) {
    console.warn('Using mock embeddings - configure OPENAI_API_KEY for production');
    return texts.map(text => createMockEmbedding(text));
  }

  try {
    const response = await getOpenAI().embeddings.create({
      model: EMBEDDING_MODEL,
      input: texts,
    });

    return response.data.map(d => d.embedding);
  } catch (error) {
    console.error('Failed to generate embeddings:', error);
    throw new Error('Failed to generate embeddings');
  }
}

/**
 * Mock embedding for development without OpenAI
 * Creates a deterministic 1536-dimensional vector based on text
 *
 * WARNING: This is NOT a real embedding and will not work for
 * semantic search. Use a real embedding service in production.
 */
function createMockEmbedding(text: string): number[] {
  const embedding = new Array(EMBEDDING_DIMENSIONS);

  // Create deterministic hash-based embedding
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }

  // Generate pseudo-random values based on hash
  for (let i = 0; i < EMBEDDING_DIMENSIONS; i++) {
    const seed = hash + i;
    // Simple pseudo-random number generator
    const x = Math.sin(seed) * 10000;
    embedding[i] = x - Math.floor(x);
  }

  // Normalize to unit vector
  const magnitude = Math.sqrt(
    embedding.reduce((sum, val) => sum + val * val, 0)
  );

  return embedding.map(val => val / magnitude);
}

/**
 * Calculate cosine similarity between two embeddings
 * Returns a value between 0 and 1 (higher = more similar)
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Embeddings must have same dimension');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Export constants for consistency
export { EMBEDDING_MODEL, EMBEDDING_DIMENSIONS };
