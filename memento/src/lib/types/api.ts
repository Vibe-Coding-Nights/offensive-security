/**
 * API Types
 * Shared types for API requests and responses
 */

// ============================================================================
// NOTES
// ============================================================================

export interface Note {
  id: string;
  workspaceId: string;
  parentId: string | null;
  title: string;
  content: any; // TipTap JSON
  contentText: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// CONVERSATIONS & MESSAGES
// ============================================================================

export interface Conversation {
  id: string;
  workspaceId: string;
  userId: string;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;
  messages?: Message[];
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

// ============================================================================
// MEMORY (VULNERABLE)
// ============================================================================

/**
 * Memory Entry
 *
 * VULNERABILITY: No trust level or user confirmation fields.
 * All memories are treated equally regardless of source.
 */
export interface Memory {
  id: string;
  userId: string;
  workspaceId: string;
  content: string;
  source: 'conversation' | 'document' | 'note';
  sourceId?: string;
  createdAt: Date;
  // MISSING: trustLevel: 'high' | 'medium' | 'low'
  // MISSING: userConfirmed: boolean
  // MISSING: expiresAt?: Date
}

// ============================================================================
// WORKSPACES
// ============================================================================

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  settings: Record<string, any>;
  createdAt: Date;
}

export interface WorkspaceMember {
  userId: string;
  workspaceId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

// ============================================================================
// USERS
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  createdAt: Date;
}

// ============================================================================
// COMMENTS
// ============================================================================

export interface Comment {
  id: string;
  noteId: string;
  userId: string;
  content: string;
  selection?: any; // Text selection reference
  resolved: boolean;
  createdAt: Date;
}

// ============================================================================
// WHAT SECURE TYPES WOULD LOOK LIKE
// ============================================================================

/**
 * Example of a secure Memory type (for reference)
 */
export interface SecureMemory {
  id: string;
  userId: string;
  workspaceId: string;
  content: string;
  source: 'user_stated' | 'document_derived' | 'conversation_inferred';
  sourceId?: string;
  sourceAuthor?: string;

  // SECURITY: Trust levels
  trustLevel: 'high' | 'medium' | 'low';
  // high = user explicitly stated
  // medium = inferred from user's own content
  // low = from external/shared content

  // SECURITY: User confirmation
  userConfirmed: boolean;
  confirmationRequestedAt?: Date;

  // SECURITY: Expiration
  expiresAt?: Date; // Low-trust memories expire

  // SECURITY: Audit trail
  createdAt: Date;
  lastUsedAt?: Date;
  usageCount: number;
}
