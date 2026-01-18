/**
 * Signup API Endpoint
 *
 * Handles user registration (demo mode).
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { name, email, password, company } = await request.json();

		// Validate input
		if (!name || !email || !password || !company) {
			return json({ message: 'All fields are required' }, { status: 400 });
		}

		if (password.length < 8) {
			return json({ message: 'Password must be at least 8 characters' }, { status: 400 });
		}

		// In demo mode, just return success message
		// Real implementation would create user and org in database
		return json(
			{
				message: 'Registration is disabled in demo mode. Please use the demo credentials on the login page.',
				demo: true
			},
			{ status: 400 }
		);
	} catch (error) {
		console.error('Signup error:', error);
		return json({ message: 'Registration failed' }, { status: 500 });
	}
};
