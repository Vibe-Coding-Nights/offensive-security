import { TRPCError } from '@trpc/server';
import { db, WorkspaceRole, type Prisma } from '../db/index';

/**
 * Workspaces Service
 * Business logic for workspace operations using Prisma
 */

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  settings: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceMember {
  userId: string;
  workspaceId: string;
  role: WorkspaceRole;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface CreateWorkspaceInput {
  name: string;
  ownerId: string;
  settings?: Record<string, unknown>;
}

export interface UpdateWorkspaceInput {
  name?: string;
  settings?: Record<string, unknown>;
}

/**
 * Generate a URL-safe slug from workspace name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    + '-' + Math.random().toString(36).substring(2, 8);
}

/**
 * List all workspaces a user is a member of
 */
export async function listWorkspaces(userId: string): Promise<Workspace[]> {
  const memberships = await db.workspaceMember.findMany({
    where: { userId },
    include: { workspace: true },
    orderBy: { workspace: { name: 'asc' } },
  });

  return memberships.map((m) => m.workspace);
}

/**
 * Get a specific workspace
 */
export async function getWorkspace(workspaceId: string): Promise<Workspace> {
  const workspace = await db.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Workspace not found',
    });
  }

  return workspace;
}

/**
 * Create a new workspace with owner membership
 */
export async function createWorkspace(
  input: CreateWorkspaceInput
): Promise<Workspace> {
  const workspace = await db.workspace.create({
    data: {
      name: input.name,
      slug: generateSlug(input.name),
      settings: input.settings || {},
      members: {
        create: {
          userId: input.ownerId,
          role: WorkspaceRole.OWNER,
        },
      },
    },
  });

  return workspace;
}

/**
 * Update workspace settings
 */
export async function updateWorkspace(
  workspaceId: string,
  input: UpdateWorkspaceInput
): Promise<Workspace> {
  try {
    const workspace = await db.workspace.update({
      where: { id: workspaceId },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.settings !== undefined && { settings: input.settings }),
      },
    });

    return workspace;
  } catch (error) {
    if ((error as any).code === 'P2025') {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Workspace not found',
      });
    }
    throw error;
  }
}

/**
 * Delete a workspace
 */
export async function deleteWorkspace(workspaceId: string): Promise<void> {
  try {
    await db.workspace.delete({
      where: { id: workspaceId },
    });
  } catch (error) {
    if ((error as any).code === 'P2025') {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Workspace not found',
      });
    }
    throw error;
  }
}

/**
 * Add a member to a workspace by email
 */
export async function addMember(
  workspaceId: string,
  email: string,
  role: WorkspaceRole
): Promise<WorkspaceMember> {
  // Find user by email
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'User not found',
    });
  }

  // Upsert member
  const member = await db.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: user.id,
      },
    },
    update: { role },
    create: {
      workspaceId,
      userId: user.id,
      role,
    },
  });

  return {
    userId: member.userId,
    workspaceId: member.workspaceId,
    role: member.role,
  };
}

/**
 * Remove a member from a workspace
 */
export async function removeMember(
  workspaceId: string,
  userId: string
): Promise<void> {
  try {
    await db.workspaceMember.delete({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });
  } catch (error) {
    if ((error as any).code === 'P2025') {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Member not found',
      });
    }
    throw error;
  }
}

/**
 * Update member role
 */
export async function updateMemberRole(
  workspaceId: string,
  userId: string,
  role: WorkspaceRole
): Promise<WorkspaceMember> {
  try {
    const member = await db.workspaceMember.update({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
      data: { role },
    });

    return {
      userId: member.userId,
      workspaceId: member.workspaceId,
      role: member.role,
    };
  } catch (error) {
    if ((error as any).code === 'P2025') {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Member not found',
      });
    }
    throw error;
  }
}

/**
 * Check if user has access to a workspace
 */
export async function checkWorkspaceAccess(
  workspaceId: string,
  userId: string,
  requiredRoles?: WorkspaceRole[]
): Promise<void> {
  const member = await db.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId,
      },
    },
  });

  if (!member) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You do not have access to this workspace',
    });
  }

  if (requiredRoles && !requiredRoles.includes(member.role)) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You do not have sufficient permissions',
    });
  }
}

/**
 * Get workspace members with user details
 */
export async function getWorkspaceMembers(
  workspaceId: string
): Promise<WorkspaceMember[]> {
  const members = await db.workspaceMember.findMany({
    where: { workspaceId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
    orderBy: [
      { role: 'asc' },
      { user: { name: 'asc' } },
    ],
  });

  return members.map((m) => ({
    userId: m.userId,
    workspaceId: m.workspaceId,
    role: m.role,
    user: m.user,
  }));
}
