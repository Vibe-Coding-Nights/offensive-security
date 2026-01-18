import { appRouter } from '$lib/server/trpc/routers';
import { createContext } from '$lib/server/trpc/trpc';
import type { RequestEvent } from '@sveltejs/kit';

/**
 * Server-side tRPC Caller
 * For use in SvelteKit load functions and server-side code
 */

export async function createCaller(event: RequestEvent) {
  const context = await createContext({
    req: event.request,
    resHeaders: new Headers(),
  });

  return appRouter.createCaller(context);
}
