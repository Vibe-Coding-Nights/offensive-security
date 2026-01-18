import { lucia } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

/**
 * SvelteKit Server Hooks
 * Validates sessions and attaches user to event.locals
 */

export const handle: Handle = async ({ event, resolve }) => {
  // Get session cookie
  const sessionId = event.cookies.get(lucia.sessionCookieName);

  if (!sessionId) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  // Validate session
  const { session, user } = await lucia.validateSession(sessionId);

  if (session && session.fresh) {
    // Refresh session cookie
    const sessionCookie = lucia.createSessionCookie(session.id);
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes,
    });
  }

  if (!session) {
    // Invalid session - clear cookie
    const sessionCookie = lucia.createBlankSessionCookie();
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes,
    });
  }

  event.locals.user = user;
  event.locals.session = session;

  return resolve(event);
};

/**
 * Type declarations for event.locals
 */
declare global {
  namespace App {
    interface Locals {
      user: import('lucia').User | null;
      session: import('lucia').Session | null;
    }
  }
}

export {};
