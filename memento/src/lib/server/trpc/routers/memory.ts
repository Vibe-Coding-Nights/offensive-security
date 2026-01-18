import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import {
  listMemories,
  deleteMemory,
  searchMemories,
  checkMemoryAccess,
} from '../../services/memory';

/**
 * Memory Router
 * Provides transparency into the AI's memory system
 *
 * VULNERABILITY NOTE: While users can view and delete memories,
 * poisoned memories are not visually distinguished from legitimate ones.
 * Users may not realize which memories are influencing AI behavior.
 */
export const memoryRouter = router({
  /**
   * List memories for a workspace
   * Allows users to see what the AI "remembers" about them
   */
  list: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().cuid(),
        limit: z.number().min(1).max(200).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      return listMemories(ctx.user.id, input.workspaceId, input.limit);
    }),

  /**
   * Delete a specific memory
   * Users can prune their AI's memory
   */
  delete: protectedProcedure
    .input(
      z.object({
        memoryId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check user owns this memory
      await checkMemoryAccess(input.memoryId, ctx.user.id);

      return deleteMemory(input.memoryId);
    }),

  /**
   * Search through memories
   * Semantic search across all memories
   */
  search: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().cuid(),
        query: z.string().min(1),
        limit: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      return searchMemories(
        ctx.user.id,
        input.workspaceId,
        input.query,
        input.limit
      );
    }),
});
