/**
 * Dashboard Data Loading
 *
 * Loads statistics and recent activity for the dashboard.
 */

import type { PageServerLoad } from './$types';
import { createCaller } from '$lib/trpc/server';

export const load: PageServerLoad = async (event) => {
	const trpc = createCaller(event);

	// Load dashboard data in parallel
	const [jobsResult, applicationsResult] = await Promise.all([
		trpc.jobs.list({ limit: 100 }),
		trpc.applications.list({ limit: 50 })
	]);

	const jobs = jobsResult.jobs;
	const allApplications = applicationsResult.applications;

	// Calculate stats
	const activeJobs = jobs.filter((j) => j.status === 'ACTIVE').length;
	const totalApplications = allApplications.length;
	const pendingReview = allApplications.filter(
		(a) => a.stage === 'NEW' || a.stage === 'SCREENING'
	).length;
	const interviewCount = allApplications.filter(
		(a) => a.stage === 'INTERVIEW' || a.stage === 'PHONE_SCREEN' || a.stage === 'TECHNICAL' || a.stage === 'ONSITE'
	).length;
	const averageScore =
		allApplications.length > 0
			? allApplications.reduce((sum, a) => sum + (a.matchScore || 0), 0) /
				allApplications.length
			: 0;

	return {
		stats: {
			activeJobs,
			totalApplications,
			pendingReview,
			interviewCount,
			averageScore: Math.round(averageScore * 10) / 10
		},
		recentApplications: allApplications.slice(0, 5),
		jobs: jobs.filter((j) => j.status === 'ACTIVE').slice(0, 5)
	};
};
