/**
 * Job Detail Data Loading & Actions
 *
 * Loads a specific job with all its applications.
 * Provides actions for stage transitions and candidate management.
 */

import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { createCaller } from '$lib/trpc/server';

export const load: PageServerLoad = async (event) => {
	const trpc = createCaller(event);
	const { id } = event.params;

	try {
		const [job, applicationsResult] = await Promise.all([
			trpc.jobs.get({ id }),
			trpc.applications.listByJob({ jobId: id })
		]);

		if (!job) {
			throw error(404, 'Job not found');
		}

		return {
			job,
			applications: applicationsResult.applications
		};
	} catch (e) {
		throw error(404, 'Job not found');
	}
};

export const actions: Actions = {
	/**
	 * Update candidate stage
	 */
	updateStage: async (event) => {
		const trpc = createCaller(event);
		const formData = await event.request.formData();
		const applicationId = formData.get('applicationId') as string;
		const stage = formData.get('stage') as string;

		if (!applicationId || !stage) {
			return fail(400, { error: 'Missing required fields' });
		}

		try {
			await trpc.applications.updateStage({
				id: applicationId,
				stage: stage as 'NEW' | 'SCREENING' | 'PHONE_SCREEN' | 'INTERVIEW' | 'TECHNICAL' | 'ONSITE' | 'OFFER' | 'HIRED' | 'REJECTED' | 'WITHDRAWN'
			});
			return { success: true, action: 'updateStage' };
		} catch (e) {
			console.error('Failed to update stage:', e);
			return fail(500, { error: 'Failed to update stage' });
		}
	},

	/**
	 * Add note to candidate
	 */
	addNote: async (event) => {
		const trpc = createCaller(event);
		const formData = await event.request.formData();
		const applicationId = formData.get('applicationId') as string;
		const note = formData.get('note') as string;

		if (!applicationId || !note) {
			return fail(400, { error: 'Missing required fields' });
		}

		try {
			await trpc.applications.addNote({
				id: applicationId,
				note
			});
			return { success: true, action: 'addNote' };
		} catch (e) {
			console.error('Failed to add note:', e);
			return fail(500, { error: 'Failed to add note' });
		}
	},

	/**
	 * Set candidate rating
	 */
	setRating: async (event) => {
		const trpc = createCaller(event);
		const formData = await event.request.formData();
		const applicationId = formData.get('applicationId') as string;
		const rating = parseInt(formData.get('rating') as string, 10);

		if (!applicationId || isNaN(rating)) {
			return fail(400, { error: 'Missing required fields' });
		}

		try {
			await trpc.applications.setRating({
				id: applicationId,
				rating
			});
			return { success: true, action: 'setRating' };
		} catch (e) {
			console.error('Failed to set rating:', e);
			return fail(500, { error: 'Failed to set rating' });
		}
	}
};
