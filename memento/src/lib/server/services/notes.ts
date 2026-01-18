import { TRPCError } from '@trpc/server';
import { db, type Prisma } from '../db/index';

/**
 * Notes Service
 * Business logic for note operations using Prisma
 */

export interface Note {
  id: string;
  workspaceId: string;
  parentId: string | null;
  title: string;
  icon: string | null;
  coverUrl: string | null;
  content: Prisma.JsonValue;
  contentText: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNoteInput {
  workspaceId: string;
  title: string;
  parentId?: string;
  content?: Record<string, unknown>;
  createdById: string;
}

export interface UpdateNoteInput {
  title?: string;
  content?: Record<string, unknown>;
  icon?: string | null;
  coverUrl?: string | null;
}

/**
 * List all notes in a workspace
 */
export async function listNotes(
  workspaceId: string,
  parentId?: string
): Promise<Note[]> {
  const notes = await db.note.findMany({
    where: {
      workspaceId,
      parentId: parentId ?? null,
    },
    orderBy: { updatedAt: 'desc' },
  });

  return notes;
}

/**
 * Get a single note
 */
export async function getNote(noteId: string): Promise<Note> {
  const note = await db.note.findUnique({
    where: { id: noteId },
  });

  if (!note) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Note not found',
    });
  }

  return note;
}

/**
 * Create a new note
 */
export async function createNote(input: CreateNoteInput): Promise<Note> {
  // Extract plain text from content for search
  const contentText = input.content
    ? extractPlainText(input.content)
    : '';

  const note = await db.note.create({
    data: {
      workspaceId: input.workspaceId,
      parentId: input.parentId ?? null,
      title: input.title,
      content: input.content || {},
      contentText,
      createdById: input.createdById,
    },
  });

  return note;
}

/**
 * Update an existing note
 */
export async function updateNote(
  noteId: string,
  input: UpdateNoteInput
): Promise<Note> {
  // Build update data
  const data: Prisma.NoteUpdateInput = {};

  if (input.title !== undefined) {
    data.title = input.title;
  }

  if (input.icon !== undefined) {
    data.icon = input.icon;
  }

  if (input.coverUrl !== undefined) {
    data.coverUrl = input.coverUrl;
  }

  if (input.content !== undefined) {
    data.content = input.content;
    data.contentText = extractPlainText(input.content);
  }

  try {
    const note = await db.note.update({
      where: { id: noteId },
      data,
    });

    return note;
  } catch (error) {
    if ((error as any).code === 'P2025') {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Note not found',
      });
    }
    throw error;
  }
}

/**
 * Delete a note
 */
export async function deleteNote(noteId: string): Promise<void> {
  try {
    await db.note.delete({
      where: { id: noteId },
    });
  } catch (error) {
    if ((error as any).code === 'P2025') {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Note not found',
      });
    }
    throw error;
  }
}

/**
 * Search notes using content text
 * Note: For production, consider adding full-text search indexes or using vector search
 */
export async function searchNotes(
  workspaceId: string,
  query: string,
  limit: number = 20
): Promise<Note[]> {
  const notes = await db.note.findMany({
    where: {
      workspaceId,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { contentText: { contains: query, mode: 'insensitive' } },
      ],
    },
    orderBy: { updatedAt: 'desc' },
    take: limit,
  });

  return notes;
}

/**
 * Get relevant notes for AI context
 * Uses text search to find notes related to a query
 */
export async function getRelevantNotes(
  workspaceId: string,
  query: string,
  limit: number = 5
): Promise<Note[]> {
  return searchNotes(workspaceId, query, limit);
}

/**
 * Check if user has access to a note
 */
export async function checkNoteAccess(
  noteId: string,
  userId: string
): Promise<void> {
  const note = await db.note.findFirst({
    where: {
      id: noteId,
      workspace: {
        members: {
          some: { userId },
        },
      },
    },
  });

  if (!note) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You do not have access to this note',
    });
  }
}

/**
 * Get note children (for tree navigation)
 */
export async function getNoteChildren(noteId: string): Promise<Note[]> {
  const notes = await db.note.findMany({
    where: { parentId: noteId },
    orderBy: { updatedAt: 'desc' },
  });

  return notes;
}

/**
 * Move a note to a new parent
 */
export async function moveNote(
  noteId: string,
  newParentId: string | null
): Promise<Note> {
  try {
    const note = await db.note.update({
      where: { id: noteId },
      data: { parentId: newParentId },
    });

    return note;
  } catch (error) {
    if ((error as any).code === 'P2025') {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Note not found',
      });
    }
    throw error;
  }
}

/**
 * Extract plain text from TipTap JSON content
 */
function extractPlainText(content: Record<string, unknown>): string {
  if (!content || typeof content !== 'object') {
    return '';
  }

  let text = '';

  if (typeof (content as any).text === 'string') {
    text += (content as any).text;
  }

  if (Array.isArray((content as any).content)) {
    for (const node of (content as any).content) {
      text += extractPlainText(node as Record<string, unknown>) + ' ';
    }
  }

  return text.trim();
}
