import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db/index';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(303, '/login');
  }

  const result = await db.workspaceMember.findFirst({
    where: { userId: locals.user.id },
    include: { workspace: true },
    orderBy: { workspace: { createdAt: 'desc' } },
  });

  if (result?.workspace) {
    throw redirect(303, `/${result.workspace.id}`);
  }

  const newWorkspace = await db.workspace.create({
    data: {
      name: 'My Workspace',
      slug: `workspace-${Date.now()}`,
      members: {
        create: {
          userId: locals.user.id,
          role: 'OWNER',
        },
      },
    },
  });

  throw redirect(303, `/${newWorkspace.id}`);
};
