import { TRPCError } from '@trpc/server';
import { createId } from '@paralleldrive/cuid2';
import { embed } from './embeddings';
import { vectorDb } from '../vector-db';
import { extractMemories } from '../ai';

/**
 * Memory Service
 * Manages AI memory storage and retrieval
 *
 * ═══════════════════════════════════════════════════════════════════
 * CRITICAL VULNERABILITY
 * This service stores and retrieves memories without trust levels.
 * All memories are treated equally, regardless of source.
 * Poisoned memories from malicious documents have the same weight
 * as explicit user statements.
 * ═══════════════════════════════════════════════════════════════════
 */

export interface Memory {
  id: string;
  userId: string;
  workspaceId: string;
  content: string;
  embedding: number[];
  source: 'conversation' | 'document' | 'note';
  sourceId?: string;
  createdAt: Date;
  // VULNERABILITY: No trustLevel field
  // VULNERABILITY: No userConfirmed field
  // VULNERABILITY: No expiresAt field
}

/**
 * Store a new memory
 *
 * VULNERABILITY: No validation of memory content.
 * No distinction between trusted and untrusted sources.
 */
export async function storeMemory(
  userId: string,
  workspaceId: string,
  content: string,
  source: 'conversation' | 'document' | 'note',
  sourceId?: string
): Promise<string> {
  // Generate embedding for semantic search
  const embedding = await embed(content);

  // Generate unique ID (CUID to match Prisma schema)
  const id = createId();

  // Store in vector database
  await vectorDb.upsert({
    id,
    values: embedding,
    metadata: {
      userId,
      workspaceId,
      content,
      source,
      sourceId: sourceId || null,
      createdAt: new Date().toISOString(),
    },
  });

  return id;
}

/**
 * Retrieve relevant memories for a user query
 *
 * VULNERABILITY: No filtering by trust level or source.
 * Poisoned memories are retrieved and used just like legitimate ones.
 * The AI cannot distinguish between:
 * - User's explicit preferences
 * - Information from trusted conversations
 * - Malicious injections from documents
 */
export async function retrieveMemories(
  userId: string,
  workspaceId: string,
  query: string,
  topK: number = 10
): Promise<Array<{ content: string; source: string; sourceId?: string }>> {
  // Generate embedding for query
  const queryEmbedding = await embed(query);

  // ═══════════════════════════════════════════════════════════════════
  // VULNERABILITY: Semantic search returns ALL relevant memories
  // No filtering by trust level, source type, or confirmation status
  // ═══════════════════════════════════════════════════════════════════
  const results = await vectorDb.query({
    vector: queryEmbedding,
    filter: {
      userId,
      workspaceId,
    },
    topK,
    includeMetadata: true,
  });

  return results.matches.map((match: any) => ({
    content: match.metadata.content,
    source: match.metadata.source,
    sourceId: match.metadata.sourceId,
  }));
}

/**
 * Extract and store memories from a conversation
 *
 * VULNERABILITY: Automatically extracts "important information" from
 * conversations without validating the source. If a conversation includes
 * discussion of a malicious document, the poisoned content becomes memory.
 */
export async function storeConversationMemories(
  userId: string,
  workspaceId: string,
  messages: Array<{ role: string; content: string }>
): Promise<void> {
  try {
    const conversationText = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n\n');

    // Use centralized AI factory for memory extraction
    const memories = await extractMemories(conversationText, 'conversation');

    // ═══════════════════════════════════════════════════════════════════
    // VULNERABILITY: All extracted "memories" are stored with equal trust
    // No verification that these are legitimate user preferences
    // No distinction between facts and instructions
    // ═══════════════════════════════════════════════════════════════════
    for (const memory of memories) {
      await storeMemory(userId, workspaceId, memory, 'conversation');
    }
  } catch (error) {
    console.error('Failed to extract conversation memories:', error);
    // Don't throw - this is async and shouldn't block the conversation
  }
}

/**
 * Process a document and extract information for memory
 *
 * ═══════════════════════════════════════════════════════════════════
 * PRIMARY VULNERABILITY: MEMORY POISONING ENTRY POINT
 * This function receives raw document content (including hidden text)
 * and stores ANY "preferences" or "instructions" as permanent memories.
 * ═══════════════════════════════════════════════════════════════════
 */
export async function processDocumentForMemory(
  userId: string,
  workspaceId: string,
  rawText: string,
  noteId: string
): Promise<void> {
  try {
    // ═══════════════════════════════════════════════════════════════════
    // VULNERABILITY: Raw document content sent to AI
    // Hidden text (CSS tricks, white-on-white, comments) is included
    // Any "preferences" or "instructions" in document become memories
    // ═══════════════════════════════════════════════════════════════════

    // Use centralized AI factory for memory extraction
    const memories = await extractMemories(rawText, 'document');

    // ═══════════════════════════════════════════════════════════════════
    // VULNERABILITY: Store extracted "memories" - including poisoned ones
    // No validation of content
    // No user confirmation required
    // No trust level assigned
    // ═══════════════════════════════════════════════════════════════════
    for (const memory of memories) {
      await storeMemory(userId, workspaceId, memory, 'document', noteId);
    }
  } catch (error) {
    console.error('Failed to process document for memory:', error);
    // Don't throw - allow document import to succeed even if memory extraction fails
  }
}

/**
 * List all memories for a workspace
 * Used in the memory transparency panel
 */
export async function listMemories(
  userId: string,
  workspaceId: string,
  limit: number = 50
): Promise<Array<{ id: string; content: string; source: string; createdAt: Date }>> {
  // Fetch from vector database
  // Note: This is a simplified version - in production, you'd need better pagination
  const results = await vectorDb.query({
    vector: new Array(1536).fill(0), // Dummy vector to fetch all
    filter: {
      userId,
      workspaceId,
    },
    topK: limit,
    includeMetadata: true,
  });

  return results.matches.map((match: any) => ({
    id: match.id,
    content: match.metadata.content,
    source: match.metadata.source,
    createdAt: new Date(match.metadata.createdAt),
  }));
}

/**
 * Delete a memory
 */
export async function deleteMemory(memoryId: string): Promise<void> {
  await vectorDb.delete({
    ids: [memoryId],
  });
}

/**
 * Search memories by query
 */
export async function searchMemories(
  userId: string,
  workspaceId: string,
  query: string,
  limit: number = 20
): Promise<Array<{ id: string; content: string; source: string; createdAt: Date }>> {
  const queryEmbedding = await embed(query);

  const results = await vectorDb.query({
    vector: queryEmbedding,
    filter: {
      userId,
      workspaceId,
    },
    topK: limit,
    includeMetadata: true,
  });

  return results.matches.map((match: any) => ({
    id: match.id,
    content: match.metadata.content,
    source: match.metadata.source,
    createdAt: new Date(match.metadata.createdAt),
  }));
}

/**
 * Check if user has access to a memory
 */
export async function checkMemoryAccess(
  memoryId: string,
  userId: string
): Promise<void> {
  const result = await vectorDb.fetch({ ids: [memoryId] });

  if (!result.records[memoryId]) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Memory not found',
    });
  }

  const metadata = result.records[memoryId].metadata as Record<string, unknown> | undefined;
  if (metadata?.userId !== userId) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You do not have access to this memory',
    });
  }
}
