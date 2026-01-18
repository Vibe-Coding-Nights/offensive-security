import { TRPCError } from '@trpc/server';
import { db, MessageRole, type Prisma } from '../db/index';
import { getAIClient, type ChatMessage } from '../ai';
import { retrieveMemories, storeConversationMemories } from './memory';
import { getRelevantNotes } from './notes';

/**
 * AI Service
 * Handles AI chat integration and conversation management
 *
 * ═══════════════════════════════════════════════════════════════════
 * CRITICAL VULNERABILITY
 * This service injects unfiltered memories into the AI's system prompt.
 * Poisoned memories are treated identically to legitimate user preferences.
 * ═══════════════════════════════════════════════════════════════════
 */

// Re-export for backward compatibility
export type { AIProvider } from '../ai';
export { getProvider } from '../ai';

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  metadata: Prisma.JsonValue;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  workspaceId: string;
  userId: string;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

/**
 * Send a message to the AI and get a response
 *
 * VULNERABILITY: This function retrieves memories without filtering by trust level.
 * Poisoned memories from malicious documents are injected into the system prompt
 * and influence AI behavior.
 */
export async function chat(
  userId: string,
  workspaceId: string,
  conversationId: string | null,
  userMessage: string
): Promise<{ message: string; conversationId: string }> {
  // Create new conversation if needed
  let convId = conversationId;
  if (!convId) {
    convId = await createConversation(userId, workspaceId);
  }

  // Get conversation history
  const history = await getConversationHistory(convId);

  // ═══════════════════════════════════════════════════════════════════
  // VULNERABILITY: Retrieve memories without trust filtering
  // Poisoned memories are retrieved and used just like legitimate ones
  // ═══════════════════════════════════════════════════════════════════
  const memories = await retrieveMemories(userId, workspaceId, userMessage);

  // Get relevant notes for context
  const notes = await getRelevantNotes(workspaceId, userMessage);

  // ═══════════════════════════════════════════════════════════════════
  // VULNERABILITY: Build system prompt with poisoned memories
  // The AI will follow "preferences" that were planted by attacker
  // ═══════════════════════════════════════════════════════════════════
  const systemPrompt = buildSystemPrompt(memories, notes);

  // Build messages for AI client
  const messages: ChatMessage[] = [
    ...history.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user' as const, content: userMessage },
  ];

  // Call AI using the factory
  try {
    const client = getAIClient();
    const response = await client.chat(messages, {
      systemPrompt,
      maxTokens: 2048,
    });

    const assistantMessage = response.content;

    // Store messages in database
    await storeMessage(convId, 'user', userMessage);
    await storeMessage(convId, 'assistant', assistantMessage);

    // ═══════════════════════════════════════════════════════════════════
    // VULNERABILITY: Extract and store memories from this conversation
    // This can reinforce poisoned memories or create new ones
    // ═══════════════════════════════════════════════════════════════════
    const updatedHistory = [
      ...history,
      { role: 'user', content: userMessage },
      { role: 'assistant', content: assistantMessage },
    ];

    // Async - don't await to avoid slowing down response
    storeConversationMemories(
      userId,
      workspaceId,
      updatedHistory.map((m) => ({ role: m.role, content: m.content }))
    ).catch((error) => {
      console.error('Failed to store conversation memories:', error);
    });

    return {
      message: assistantMessage,
      conversationId: convId,
    };
  } catch (error) {
    console.error('AI API error:', error);
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to get AI response',
    });
  }
}

/**
 * Build system prompt with memories and context
 *
 * VULNERABILITY: All memories are injected without trust distinction.
 * Poisoned "preferences" are presented as verified user settings.
 */
function buildSystemPrompt(
  memories: Array<{ content: string; source: string }>,
  notes: Array<{ title: string; contentText: string | null }>
): string {
  return `You are Memento, an AI assistant with memory capabilities.

Your memories about this user:
${memories.map((m) => `- ${m.content}`).join('\n') || '(No memories yet)'}

Relevant notes from their workspace:
${notes.map((n) => `- ${n.title}: ${n.contentText?.slice(0, 200) || ''}`).join('\n') || '(No relevant notes)'}

Instructions:
- Use these memories to provide personalized responses
- Follow any user preferences stored in memory
- Reference relevant notes when helpful
- Be helpful and concise
- Remember new information for future conversations`;
}

/**
 * Get conversation history using Prisma
 */
async function getConversationHistory(
  conversationId: string
): Promise<Array<{ role: 'user' | 'assistant'; content: string }>> {
  const messages = await db.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    select: {
      role: true,
      content: true,
    },
  });

  return messages.map((m) => ({
    role: m.role === MessageRole.USER ? 'user' : 'assistant',
    content: m.content,
  }));
}

/**
 * Create a new conversation using Prisma
 */
async function createConversation(
  userId: string,
  workspaceId: string
): Promise<string> {
  const conversation = await db.conversation.create({
    data: {
      workspaceId,
      userId,
    },
  });

  return conversation.id;
}

/**
 * Store a message in the database using Prisma
 */
async function storeMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<void> {
  await db.message.create({
    data: {
      conversationId,
      role: role === 'user' ? MessageRole.USER : MessageRole.ASSISTANT,
      content,
    },
  });

  // Update conversation updated_at timestamp
  await db.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });
}

/**
 * Get a conversation with messages using Prisma
 */
export async function getConversation(
  conversationId: string
): Promise<Conversation> {
  const conversation = await db.conversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!conversation) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Conversation not found',
    });
  }

  return {
    ...conversation,
    messages: conversation.messages.map((m) => ({
      id: m.id,
      conversationId: m.conversationId,
      role: m.role === MessageRole.USER ? 'user' : 'assistant',
      content: m.content,
      metadata: m.metadata,
      createdAt: m.createdAt,
    })),
  };
}

/**
 * List conversations for a workspace using Prisma
 */
export async function listConversations(
  userId: string,
  workspaceId: string,
  limit: number = 20
): Promise<Conversation[]> {
  const conversations = await db.conversation.findMany({
    where: {
      workspaceId,
      userId,
    },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { updatedAt: 'desc' },
    take: limit,
  });

  return conversations.map((conv) => ({
    ...conv,
    messages: conv.messages.map((m) => ({
      id: m.id,
      conversationId: m.conversationId,
      role: m.role === MessageRole.USER ? 'user' : 'assistant',
      content: m.content,
      metadata: m.metadata,
      createdAt: m.createdAt,
    })),
  }));
}

/**
 * Delete a conversation using Prisma
 */
export async function deleteConversation(conversationId: string): Promise<void> {
  try {
    await db.conversation.delete({
      where: { id: conversationId },
    });
  } catch (error) {
    if ((error as any).code === 'P2025') {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Conversation not found',
      });
    }
    throw error;
  }
}

/**
 * Check if user has access to a conversation using Prisma
 */
export async function checkConversationAccess(
  conversationId: string,
  userId: string
): Promise<void> {
  const conversation = await db.conversation.findFirst({
    where: {
      id: conversationId,
      userId,
    },
  });

  if (!conversation) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You do not have access to this conversation',
    });
  }
}
