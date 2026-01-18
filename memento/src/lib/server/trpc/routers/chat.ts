import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import {
  chat,
  getConversation,
  listConversations,
  deleteConversation,
  checkConversationAccess,
} from '../../services/ai';

/**
 * Chat Router
 * Handles AI conversation functionality
 *
 * VULNERABILITY: Uses the memory system which can be poisoned
 * via document imports
 */
export const chatRouter = router({
  /**
   * Send a message to the AI
   * Creates a new conversation if conversationId is not provided
   *
   * CRITICAL: This is where poisoned memories influence AI responses
   */
  send: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
        conversationId: z.string().uuid().optional(),
        message: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Validate conversation access if provided
      if (input.conversationId) {
        await checkConversationAccess(input.conversationId, ctx.user.id);
      }

      // Call AI service - retrieves memories (including poisoned ones)
      return chat(
        ctx.user.id,
        input.workspaceId,
        input.conversationId ?? null,
        input.message
      );
    }),

  /**
   * Get conversation history
   */
  getConversation: protectedProcedure
    .input(
      z.object({
        conversationId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Check user has access to this conversation
      await checkConversationAccess(input.conversationId, ctx.user.id);

      return getConversation(input.conversationId);
    }),

  /**
   * List all conversations for a workspace
   */
  listConversations: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
        limit: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      return listConversations(ctx.user.id, input.workspaceId, input.limit);
    }),

  /**
   * Delete a conversation
   */
  deleteConversation: protectedProcedure
    .input(
      z.object({
        conversationId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check user has access to this conversation
      await checkConversationAccess(input.conversationId, ctx.user.id);

      return deleteConversation(input.conversationId);
    }),
});
