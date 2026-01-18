import { Lucia } from 'lucia';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { dev } from '$app/environment';
import { db } from './db/index';

/**
 * Lucia Auth Setup
 * Session-based authentication using Prisma adapter
 */

// Create Prisma adapter for Lucia
const adapter = new PrismaAdapter(db.session, db.user);

// Initialize Lucia
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !dev,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      name: attributes.name,
      avatarUrl: attributes.avatarUrl,
    };
  },
});

// Type declarations for TypeScript
declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  email: string;
  name: string;
  avatarUrl: string | null;
}

/**
 * Export User and Session types
 */
export type User = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
};

export type Session = {
  id: string;
  userId: string;
  expiresAt: Date;
};
