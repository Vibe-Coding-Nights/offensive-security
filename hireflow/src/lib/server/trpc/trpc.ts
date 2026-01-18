import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import type { User, Session } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';
import { db } from '../db';

/**
 * Context passed to every tRPC procedure
 */
export type Context = {
	db: typeof db;
	user: User | null;
	session: Session | null;
};

/**
 * Create context for each request
 */
export function createContext(event: RequestEvent): Context {
	return {
		db,
		user: event.locals.user as User | null,
		session: event.locals.session as Session | null
	};
}

/**
 * Initialize tRPC with context and superjson transformer
 */
const t = initTRPC.context<Context>().create({
	transformer: superjson,
	errorFormatter({ shape }) {
		return shape;
	}
});

/**
 * Export tRPC primitives
 */
export const router = t.router;
export const middleware = t.middleware;

/**
 * Public procedure - no authentication required
 * Used for: job listings, application submission
 */
export const publicProcedure = t.procedure;

/**
 * Auth middleware - checks if user is logged in
 */
const isAuthenticated = middleware(async ({ ctx, next }) => {
	if (!ctx.user || !ctx.session) {
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'You must be logged in to perform this action'
		});
	}

	return next({
		ctx: {
			...ctx,
			user: ctx.user,
			session: ctx.session
		}
	});
});

/**
 * Protected procedure - requires authentication
 * Used for: dashboard, job management, candidate review
 */
export const protectedProcedure = t.procedure.use(isAuthenticated);

/**
 * Admin middleware - checks if user is org admin or owner
 */
const isAdmin = middleware(async ({ ctx, next }) => {
	if (!ctx.user) {
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'You must be logged in'
		});
	}

	if (ctx.user.role !== 'ADMIN' && ctx.user.role !== 'OWNER') {
		throw new TRPCError({
			code: 'FORBIDDEN',
			message: 'You do not have permission to perform this action'
		});
	}

	return next({ ctx });
});

/**
 * Admin procedure - requires admin role
 * Used for: org settings, team management
 */
export const adminProcedure = t.procedure.use(isAuthenticated).use(isAdmin);
