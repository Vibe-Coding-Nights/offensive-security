import { Pinecone } from '@pinecone-database/pinecone';
import { db } from './db/index';

/**
 * Vector Database Connection (Pinecone or Mock)
 * Uses Pinecone for production, Prisma for workshop/dev mode
 */

// Check if we're in mock mode (no Pinecone configured)
const MOCK_MODE = !process.env.PINECONE_API_KEY;

if (MOCK_MODE) {
  console.log('Vector DB: Using mock mode (Prisma) - configure PINECONE_API_KEY for production');
}

// In-memory store for mock mode vectors (for similarity search demo)
const mockVectors: Map<string, { values: number[]; metadata: Record<string, any> }> = new Map();

// Lazy-initialized Pinecone client
let pinecone: Pinecone | null = null;

function getPinecone(): Pinecone {
  if (!pinecone) {
    const apiKey = process.env.PINECONE_API_KEY;
    if (!apiKey) {
      throw new Error('PINECONE_API_KEY is not configured');
    }
    pinecone = new Pinecone({ apiKey });
  }
  return pinecone;
}

/**
 * Get the Pinecone index
 */
export function getIndex() {
  const indexName = process.env.PINECONE_INDEX || 'memento-memories';
  return getPinecone().index(indexName);
}

/**
 * Upsert a vector (memory) into the database
 */
export async function upsert(params: {
  id: string;
  values: number[];
  metadata: Record<string, any>;
}) {
  if (MOCK_MODE) {
    // Store in mock map and Prisma
    mockVectors.set(params.id, { values: params.values, metadata: params.metadata });

    // Also store in Prisma Memory table for persistence
    await db.memory.create({
      data: {
        id: params.id,
        userId: params.metadata.userId,
        workspaceId: params.metadata.workspaceId,
        content: params.metadata.content,
        source: params.metadata.source?.toUpperCase() || 'DOCUMENT',
        sourceId: params.metadata.sourceId,
      },
    });
    return;
  }

  const index = getIndex();
  await index.upsert([
    {
      id: params.id,
      values: params.values,
      metadata: params.metadata,
    },
  ]);
}

/**
 * Query for similar vectors
 */
export async function query(params: {
  vector: number[];
  filter?: Record<string, any>;
  topK: number;
  includeMetadata?: boolean;
}) {
  if (MOCK_MODE) {
    // In mock mode, query from Prisma instead
    const memories = await db.memory.findMany({
      where: {
        userId: params.filter?.userId,
        workspaceId: params.filter?.workspaceId,
      },
      take: params.topK,
      orderBy: { createdAt: 'desc' },
    });

    return {
      matches: memories.map(m => ({
        id: m.id,
        score: 1.0, // Mock similarity score
        metadata: {
          content: m.content,
          source: m.source.toLowerCase(),
          sourceId: m.sourceId,
          userId: m.userId,
          workspaceId: m.workspaceId,
          createdAt: m.createdAt.toISOString(),
        },
      })),
    };
  }

  const index = getIndex();
  return index.query({
    vector: params.vector,
    filter: params.filter,
    topK: params.topK,
    includeMetadata: params.includeMetadata ?? true,
  });
}

/**
 * Fetch specific vectors by ID
 */
export async function fetch(params: { ids: string[] }) {
  if (MOCK_MODE) {
    const memories = await db.memory.findMany({
      where: { id: { in: params.ids } },
    });

    const records: Record<string, any> = {};
    for (const m of memories) {
      records[m.id] = {
        id: m.id,
        metadata: {
          content: m.content,
          source: m.source.toLowerCase(),
          sourceId: m.sourceId,
          userId: m.userId,
          workspaceId: m.workspaceId,
          createdAt: m.createdAt.toISOString(),
        },
      };
    }
    return { records };
  }

  const index = getIndex();
  return index.fetch(params.ids);
}

/**
 * Delete vectors
 */
export async function deleteVectors(params: { ids: string[] }) {
  if (MOCK_MODE) {
    await db.memory.deleteMany({
      where: { id: { in: params.ids } },
    });
    for (const id of params.ids) {
      mockVectors.delete(id);
    }
    return;
  }

  const index = getIndex();
  await index.deleteMany(params.ids);
}

/**
 * Export vector DB interface
 */
export const vectorDb = {
  upsert,
  query,
  fetch,
  delete: deleteVectors,
};
