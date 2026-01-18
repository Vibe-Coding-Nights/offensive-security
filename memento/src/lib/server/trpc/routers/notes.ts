import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import {
  listNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
  checkNoteAccess,
} from '../../services/notes';

/**
 * Notes Router
 * Handles all note CRUD operations
 */
export const notesRouter = router({
  /**
   * List all notes in a workspace
   */
  list: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
        parentId: z.string().uuid().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return listNotes(input.workspaceId, input.parentId);
    }),

  /**
   * Get a single note by ID
   */
  get: protectedProcedure
    .input(
      z.object({
        noteId: z.string().uuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Check user has access to this note
      await checkNoteAccess(input.noteId, ctx.user.id);

      return getNote(input.noteId);
    }),

  /**
   * Create a new note
   */
  create: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
        title: z.string().default('Untitled'),
        parentId: z.string().uuid().optional(),
        content: z.any().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return createNote({
        workspaceId: input.workspaceId,
        title: input.title,
        parentId: input.parentId,
        content: input.content,
        createdBy: ctx.user.id,
      });
    }),

  /**
   * Update an existing note
   */
  update: protectedProcedure
    .input(
      z.object({
        noteId: z.string().uuid(),
        title: z.string().optional(),
        content: z.any().optional(),
        icon: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check user has access to this note
      await checkNoteAccess(input.noteId, ctx.user.id);

      return updateNote(input.noteId, {
        title: input.title,
        content: input.content,
        icon: input.icon,
      });
    }),

  /**
   * Delete a note
   */
  delete: protectedProcedure
    .input(
      z.object({
        noteId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check user has access to this note
      await checkNoteAccess(input.noteId, ctx.user.id);

      return deleteNote(input.noteId);
    }),

  /**
   * Full-text search across notes in a workspace
   */
  search: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().uuid(),
        query: z.string().min(1),
        limit: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      return searchNotes(input.workspaceId, input.query, input.limit);
    }),
});
