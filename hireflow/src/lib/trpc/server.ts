/**
 * tRPC Server-Side Caller
 *
 * Used in +page.server.ts to call tRPC procedures directly
 * without HTTP overhead.
 */

import { appRouter } from '$lib/server/trpc/routers';
import { createContext } from '$lib/server/trpc/trpc';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * Create a server-side caller for use in load functions
 */
export function createCaller(event: RequestEvent) {
	return appRouter.createCaller(createContext(event));
}

export type Caller = ReturnType<typeof createCaller>;
