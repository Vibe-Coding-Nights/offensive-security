import { json } from '@sveltejs/kit';
import { lucia } from '$lib/server/auth';
import { db } from '$lib/server/db/index';
import { generateIdFromEntropySize } from 'lucia';
import { hash } from '@node-rs/argon2';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const body = await request.json();
  const { email, password, name } = body;

  if (!email || typeof email !== 'string') {
    return json({ error: 'Invalid email' }, { status: 400 });
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    return json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }

  if (!name || typeof name !== 'string') {
    return json({ error: 'Name is required' }, { status: 400 });
  }

  const emailLower = email.toLowerCase().trim();

  try {
    const existingUser = await db.user.findFirst({
      where: {
        email: {
          equals: emailLower,
          mode: 'insensitive',
        },
      },
    });

    if (existingUser) {
      return json({ error: 'Email already registered' }, { status: 400 });
    }

    const userId = generateIdFromEntropySize(10);
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    await db.user.create({
      data: {
        id: userId,
        email: emailLower,
        name: name.trim(),
        hashedPassword: passwordHash,
      },
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes,
    });

    return json({ success: true, userId });
  } catch (err) {
    console.error('Signup error:', err);
    return json({ error: 'Failed to create account' }, { status: 500 });
  }
};
