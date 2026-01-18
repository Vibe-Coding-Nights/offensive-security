import { router } from '../trpc';
import { notesRouter } from './notes';
import { chatRouter } from './chat';
import { memoryRouter } from './memory';
import { importRouter } from './import';
import { workspacesRouter } from './workspaces';

/**
 * Main tRPC Router
 * Combines all sub-routers into a single API
 */
export const appRouter = router({
  notes: notesRouter,
  chat: chatRouter,
  memory: memoryRouter,
  import: importRouter,
  workspaces: workspacesRouter,
});

/**
 * Export type definition for use in frontend
 */
export type AppRouter = typeof appRouter;
