/**
 * tRPC Client for Browser
 *
 * Used in Svelte components to call tRPC procedures.
 */

import { createTRPCClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import type { AppRouter } from '$lib/server/trpc/routers';

/**
 * Create a tRPC client for browser use
 */
export function createClient() {
	return createTRPCClient<AppRouter>({
		links: [
			httpBatchLink({
				url: '/api/trpc',
				transformer: superjson,
				headers() {
					return {
						// Add any auth headers if needed
					};
				}
			})
		]
	});
}

// Singleton client instance
let client: ReturnType<typeof createClient> | null = null;

export function getClient() {
	if (!client) {
		client = createClient();
	}
	return client;
}

// Type-safe client for use in components
export const trpc = {
	get client() {
		return getClient();
	}
};
