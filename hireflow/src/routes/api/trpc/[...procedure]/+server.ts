/**
 * tRPC HTTP Handler
 *
 * Handles all tRPC requests via /api/trpc/*
 */

import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '$lib/server/trpc/routers';
import { createContext } from '$lib/server/trpc/trpc';
import type { RequestHandler } from './$types';

const handler: RequestHandler = async (event) => {
	return fetchRequestHandler({
		endpoint: '/api/trpc',
		req: event.request,
		router: appRouter,
		createContext: () => createContext(event),
		onError: ({ path, error }) => {
			console.error(`tRPC error on ${path}:`, error);
		}
	});
};

export const GET = handler;
export const POST = handler;
