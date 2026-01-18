/**
 * Lucia Authentication Configuration
 *
 * Handles user sessions and authentication.
 */

import { Lucia } from 'lucia';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { db } from '$lib/server/db';
import { dev } from '$app/environment';

const adapter = new PrismaAdapter(db.session, db.user);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			email: attributes.email,
			name: attributes.name,
			role: attributes.role,
			orgId: attributes.orgId
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	email: string;
	name: string;
	role: string;
	orgId: string;
}

/**
 * Hash a password using Web Crypto API
 */
export async function hashPassword(password: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const salt = crypto.getRandomValues(new Uint8Array(16));

	const key = await crypto.subtle.importKey('raw', data, { name: 'PBKDF2' }, false, [
		'deriveBits'
	]);

	const hash = await crypto.subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt,
			iterations: 100000,
			hash: 'SHA-256'
		},
		key,
		256
	);

	const hashArray = new Uint8Array(hash);
	const combined = new Uint8Array(salt.length + hashArray.length);
	combined.set(salt);
	combined.set(hashArray, salt.length);

	return btoa(String.fromCharCode(...combined));
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
	const combined = Uint8Array.from(atob(storedHash), (c) => c.charCodeAt(0));
	const salt = combined.slice(0, 16);
	const storedHashBytes = combined.slice(16);

	const encoder = new TextEncoder();
	const data = encoder.encode(password);

	const key = await crypto.subtle.importKey('raw', data, { name: 'PBKDF2' }, false, [
		'deriveBits'
	]);

	const hash = await crypto.subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt,
			iterations: 100000,
			hash: 'SHA-256'
		},
		key,
		256
	);

	const hashArray = new Uint8Array(hash);

	if (hashArray.length !== storedHashBytes.length) return false;
	return hashArray.every((byte, i) => byte === storedHashBytes[i]);
}
