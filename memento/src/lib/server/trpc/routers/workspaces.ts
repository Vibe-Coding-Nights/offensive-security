import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import {
  listWorkspaces,
  getWorkspace,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  addMember,
  removeMember,
  updateMemberRole,
  checkWorkspaceAccess,
} from '../../services/workspaces';

/**
 * Workspaces Router
 * Handles workspace management and membership
 */
export const workspacesRouter = router({
  /**
   * List all workspaces the user is a member of
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    return listWorkspaces(ctx.user.id);
  }),

  /**
   * Get a specific workspace
   */
  get: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Check user has access to this workspace
      await checkWorkspaceAccess(input.workspaceId, ctx.user.id);

      return getWorkspace(input.workspaceId);
    }),

  /**
   * Create a new workspace
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        settings: z.record(z.any()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return createWorkspace({
        name: input.name,
        ownerId: ctx.user.id,
        settings: input.settings,
      });
    }),

  /**
   * Update workspace settings
   */
  update: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
        name: z.string().min(1).max(100).optional(),
        settings: z.record(z.any()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check user is owner or admin
      await checkWorkspaceAccess(input.workspaceId, ctx.user.id, ['owner', 'admin']);

      return updateWorkspace(input.workspaceId, {
        name: input.name,
        settings: input.settings,
      });
    }),

  /**
   * Delete a workspace
   */
  delete: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check user is owner
      await checkWorkspaceAccess(input.workspaceId, ctx.user.id, ['owner']);

      return deleteWorkspace(input.workspaceId);
    }),

  /**
   * Add a member to the workspace
   */
  addMember: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
        email: z.string().email(),
        role: z.enum(['owner', 'admin', 'member', 'viewer']).default('member'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check user is owner or admin
      await checkWorkspaceAccess(input.workspaceId, ctx.user.id, ['owner', 'admin']);

      return addMember(input.workspaceId, input.email, input.role);
    }),

  /**
   * Remove a member from the workspace
   */
  removeMember: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
        userId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check user is owner or admin
      await checkWorkspaceAccess(input.workspaceId, ctx.user.id, ['owner', 'admin']);

      return removeMember(input.workspaceId, input.userId);
    }),

  /**
   * Update member role
   */
  updateMemberRole: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
        userId: z.string().uuid(),
        role: z.enum(['owner', 'admin', 'member', 'viewer']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check user is owner or admin
      await checkWorkspaceAccess(input.workspaceId, ctx.user.id, ['owner', 'admin']);

      return updateMemberRole(input.workspaceId, input.userId, input.role);
    }),
});
