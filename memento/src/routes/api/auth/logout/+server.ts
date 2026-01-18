import { json } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, cookies }) => {
  if (!locals.session) {
    return json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    await lucia.invalidateSession(locals.session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes,
    });

    return json({ success: true });
  } catch (err) {
    console.error('Logout error:', err);
    return json({ error: 'Failed to logout' }, { status: 500 });
  }
};
