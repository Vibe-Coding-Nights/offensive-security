import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '$lib/server/trpc/routers';
import { browser } from '$app/environment';

/**
 * Browser tRPC Client
 * Type-safe API client for use in Svelte components
 */

function getUrl() {
  if (browser) {
    return '/api/trpc';
  }

  // SSR - use full URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api/trpc`;
  }

  return `http://localhost:${process.env.PORT ?? 5173}/api/trpc`;
}

/**
 * Create tRPC client
 */
export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: getUrl(),
      // Send cookies with requests
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        });
      },
    }),
  ],
});
