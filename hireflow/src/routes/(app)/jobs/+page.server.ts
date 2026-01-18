/**
 * Jobs List Data Loading
 *
 * Loads all jobs for the current organization with stats.
 */

import type { PageServerLoad } from './$types';
import { createCaller } from '$lib/trpc/server';
import { db } from '$lib/server/db';

export const load: PageServerLoad = async (event) => {
	const trpc = createCaller(event);

	const result = await trpc.jobs.list({ limit: 100 });

	// Enrich jobs with stage breakdowns and average scores
	const jobsWithStats = await Promise.all(
		result.jobs.map(async (job) => {
			// Get stage breakdown
			const stageBreakdown = await db.application.groupBy({
				by: ['stage'],
				where: { jobId: job.id },
				_count: true
			});

			// Get average score
			const scoreAgg = await db.application.aggregate({
				where: { jobId: job.id, matchScore: { not: null } },
				_avg: { matchScore: true }
			});

			const stageCounts = Object.fromEntries(
				stageBreakdown.map((s) => [s.stage, s._count])
			);

			return {
				...job,
				stageCounts,
				newCount: stageCounts['NEW'] || 0,
				interviewingCount:
					(stageCounts['INTERVIEW'] || 0) +
					(stageCounts['PHONE_SCREEN'] || 0) +
					(stageCounts['TECHNICAL'] || 0) +
					(stageCounts['ONSITE'] || 0),
				avgScore: scoreAgg._avg.matchScore
					? Math.round(scoreAgg._avg.matchScore * 10) / 10
					: null
			};
		})
	);

	return {
		jobs: jobsWithStats
	};
};
