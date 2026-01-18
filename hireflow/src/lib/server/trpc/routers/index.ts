import { router } from '../trpc';
import { jobsRouter } from './jobs';
import { applicationsRouter } from './applications';
import { analysisRouter } from './analysis';

/**
 * Main application router
 *
 * Combines all sub-routers into the main API
 */
export const appRouter = router({
	jobs: jobsRouter,
	applications: applicationsRouter,
	analysis: analysisRouter
});

/**
 * Export type for client usage
 */
export type AppRouter = typeof appRouter;
