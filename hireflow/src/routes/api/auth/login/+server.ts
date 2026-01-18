/**
 * Login API Endpoint
 *
 * Handles user authentication.
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { lucia, verifyPassword } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { email, password } = await request.json();

	if (!email || !password) {
		return json({ message: 'Email and password are required' }, { status: 400 });
	}

	// Find user
	const user = await db.user.findUnique({
		where: { email }
	});

	if (!user) {
		return json({ message: 'Invalid email or password' }, { status: 401 });
	}

	// Verify password
	if (!user.hashedPassword) {
		return json({ message: 'Account not set up for password login' }, { status: 401 });
	}

	// Check if it's a demo hash (base64 encoded "demo:password")
	let isValid = false;
	try {
		const decoded = Buffer.from(user.hashedPassword, 'base64').toString();
		if (decoded.startsWith('demo:')) {
			// Demo mode - simple check
			isValid = decoded === `demo:${password}`;
		} else {
			// Production mode - use proper verification
			isValid = await verifyPassword(password, user.hashedPassword);
		}
	} catch {
		// Not valid base64, try production verification
		isValid = await verifyPassword(password, user.hashedPassword);
	}

	if (!isValid) {
		return json({ message: 'Invalid email or password' }, { status: 401 });
	}

	// Create session
	const session = await lucia.createSession(user.id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);

	cookies.set(sessionCookie.name, sessionCookie.value, {
		path: '/',
		...sessionCookie.attributes
	});

	return json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
};
