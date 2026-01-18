/**
 * New Job Server Actions
 *
 * Handles job creation form submission.
 */

import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createCaller } from '$lib/trpc/server';

export const actions: Actions = {
	default: async (event) => {
		const trpc = createCaller(event);
		const formData = await event.request.formData();

		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const requirements = formData.get('requirements') as string;
		const location = formData.get('location') as string | null;
		const salaryMinStr = formData.get('salaryMin') as string | null;
		const salaryMaxStr = formData.get('salaryMax') as string | null;

		// Validation
		if (!title || !description || !requirements) {
			return fail(400, {
				message: 'Title, description, and requirements are required',
				title,
				description,
				requirements,
				location
			});
		}

		const salaryMin = salaryMinStr ? parseInt(salaryMinStr, 10) : undefined;
		const salaryMax = salaryMaxStr ? parseInt(salaryMaxStr, 10) : undefined;

		// Validate salary values
		const MAX_SALARY = 2_000_000_000; // INT4 max is ~2.1B, leave margin
		if (salaryMin !== undefined && (isNaN(salaryMin) || salaryMin < 0 || salaryMin > MAX_SALARY)) {
			return fail(400, {
				message: 'Invalid minimum salary. Must be between 0 and 2 billion.',
				title, description, requirements, location
			});
		}
		if (salaryMax !== undefined && (isNaN(salaryMax) || salaryMax < 0 || salaryMax > MAX_SALARY)) {
			return fail(400, {
				message: 'Invalid maximum salary. Must be between 0 and 2 billion.',
				title, description, requirements, location
			});
		}
		if (salaryMin !== undefined && salaryMax !== undefined && salaryMin > salaryMax) {
			return fail(400, {
				message: 'Minimum salary cannot be greater than maximum salary.',
				title, description, requirements, location
			});
		}

		let jobId: string;
		try {
			const job = await trpc.jobs.create({
				title,
				description,
				requirements,
				location: location || undefined,
				salaryMin,
				salaryMax,
				status: 'ACTIVE' // Publish immediately
			});
			jobId = job.id;
		} catch (error) {
			console.error('Failed to create job:', error);
			return fail(500, {
				message: 'Failed to create job. Please try again.',
				title,
				description,
				requirements,
				location
			});
		}

		redirect(303, `/jobs/${jobId}`);
	}
};
