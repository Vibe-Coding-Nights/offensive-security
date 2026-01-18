import { json } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';
import { db } from '$lib/server/db/index';
import { verify } from '@node-rs/argon2';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const body = await request.json();
  const { email, password } = body;

  if (!email || typeof email !== 'string') {
    return json({ error: 'Invalid email' }, { status: 400 });
  }

  if (!password || typeof password !== 'string') {
    return json({ error: 'Invalid password' }, { status: 400 });
  }

  const emailLower = email.toLowerCase().trim();

  try {
    const user = await db.user.findFirst({
      where: {
        email: {
          equals: emailLower,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        hashedPassword: true,
      },
    });

    if (!user) {
      return json({ error: 'Invalid email or password' }, { status: 400 });
    }

    if (!user.hashedPassword) {
      return json({ error: 'Invalid email or password' }, { status: 400 });
    }

    const validPassword = await verify(user.hashedPassword, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) {
      return json({ error: 'Invalid email or password' }, { status: 400 });
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes,
    });

    return json({ success: true });
  } catch (err) {
    console.error('Login error:', err);
    return json({ error: 'Failed to login' }, { status: 500 });
  }
};
