import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
  if (!locals.user) {
    const redirectUrl = encodeURIComponent(url.pathname);
    throw redirect(303, `/login?redirect=${redirectUrl}`);
  }

  return {
    user: {
      id: locals.user.id,
      email: locals.user.email,
      name: locals.user.name,
      avatarUrl: locals.user.avatarUrl,
    },
  };
};
