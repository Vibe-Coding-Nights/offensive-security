import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '$lib/server/trpc/routers';
import { createContext } from '$lib/server/trpc/trpc';
import type { RequestHandler } from './$types';

/**
 * tRPC Request Handler
 * Handles all tRPC API requests at /api/trpc/*
 */

const handler: RequestHandler = async (event) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: event.request,
    router: appRouter,
    createContext: async () => {
      return createContext({
        req: event.request,
        resHeaders: new Headers(),
      });
    },
    onError: ({ error, type, path }) => {
      console.error(`tRPC Error [${type}] at ${path}:`, error);
    },
  });
};

export const GET = handler;
export const POST = handler;
