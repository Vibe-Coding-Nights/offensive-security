import { initTRPC, TRPCError } from '@trpc/server';
import { db } from '../db/index';
import { lucia } from '../auth';
import type { Session, User } from 'lucia';

/**
 * tRPC Context
 * Contains database connection, authenticated user, and session
 */
export interface Context {
  db: typeof db;
  user: User | null;
  session: Session | null;
}

/**
 * Context options for creating tRPC context
 */
export interface CreateContextOptions {
  req: Request;
  resHeaders: Headers;
}

/**
 * Create context for each request
 * Validates session and attaches user information
 */
export async function createContext(
  opts: CreateContextOptions
): Promise<Context> {
  const sessionId = lucia.readSessionCookie(opts.req.headers.get('Cookie') ?? '');

  if (!sessionId) {
    return {
      db,
      user: null,
      session: null,
    };
  }

  const { session, user } = await lucia.validateSession(sessionId);

  return {
    db,
    user,
    session,
  };
}

/**
 * Initialize tRPC instance
 */
const t = initTRPC.context<Context>().create();

/**
 * Export router and procedure helpers
 */
export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;

/**
 * Protected procedure - requires authentication
 * Throws UNAUTHORIZED error if user is not authenticated
 */
export const protectedProcedure = t.procedure.use(
  middleware(async ({ ctx, next }) => {
    if (!ctx.user || !ctx.session) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be logged in to perform this action',
      });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
        session: ctx.session,
      },
    });
  })
);
