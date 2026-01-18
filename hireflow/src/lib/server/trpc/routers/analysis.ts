import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { triggerAnalysis } from '../../services/analysis';

/**
 * Analysis Router
 *
 * Endpoints for triggering and managing resume analysis
 */
export const analysisRouter = router({
	/**
	 * Trigger analysis for an application
	 */
	trigger: protectedProcedure
		.input(z.object({ applicationId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			// Verify application exists and user has access
			const application = await ctx.db.application.findFirst({
				where: { id: input.applicationId },
				include: { job: { select: { orgId: true } } }
			});

			if (!application || application.job.orgId !== ctx.user.orgId) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Application not found'
				});
			}

			if (application.analysisStatus === 'ANALYZING') {
				throw new TRPCError({
					code: 'CONFLICT',
					message: 'Analysis is already in progress'
				});
			}

			// Trigger the analysis
			await triggerAnalysis(input.applicationId);

			return { success: true };
		}),

	/**
	 * Get analysis status for an application
	 */
	status: protectedProcedure
		.input(z.object({ applicationId: z.string() }))
		.query(async ({ ctx, input }) => {
			const application = await ctx.db.application.findFirst({
				where: { id: input.applicationId },
				select: {
					analysisStatus: true,
					matchScore: true,
					analysisSummary: true,
					keyQualifications: true,
					concerns: true,
					recommendation: true,
					analyzedAt: true,
					job: { select: { orgId: true } }
				}
			});

			if (!application || application.job.orgId !== ctx.user.orgId) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Application not found'
				});
			}

			return {
				status: application.analysisStatus,
				result:
					application.analysisStatus === 'ANALYZED'
						? {
								matchScore: application.matchScore,
								summary: application.analysisSummary,
								keyQualifications: application.keyQualifications,
								concerns: application.concerns,
								recommendation: application.recommendation,
								analyzedAt: application.analyzedAt
							}
						: null
			};
		}),

	/**
	 * Re-analyze a resume (e.g., after job requirements change)
	 */
	reanalyze: protectedProcedure
		.input(z.object({ applicationId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const application = await ctx.db.application.findFirst({
				where: { id: input.applicationId },
				include: { job: { select: { orgId: true } } }
			});

			if (!application || application.job.orgId !== ctx.user.orgId) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Application not found'
				});
			}

			// Reset analysis status
			await ctx.db.application.update({
				where: { id: input.applicationId },
				data: {
					analysisStatus: 'PENDING',
					matchScore: null,
					analysisSummary: null,
					keyQualifications: [],
					concerns: [],
					recommendation: null,
					analysisRawJson: undefined,
					analyzedAt: null
				}
			});

			// Trigger new analysis
			await triggerAnalysis(input.applicationId);

			return { success: true };
		}),

	/**
	 * Batch analyze all pending applications for a job
	 */
	batchAnalyze: protectedProcedure
		.input(z.object({ jobId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const job = await ctx.db.job.findFirst({
				where: { id: input.jobId, orgId: ctx.user.orgId }
			});

			if (!job) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Job not found'
				});
			}

			const pendingApplications = await ctx.db.application.findMany({
				where: {
					jobId: input.jobId,
					analysisStatus: 'PENDING'
				},
				select: { id: true }
			});

			// Queue all for analysis
			const results = await Promise.allSettled(
				pendingApplications.map((app) => triggerAnalysis(app.id))
			);

			const succeeded = results.filter((r) => r.status === 'fulfilled').length;
			const failed = results.filter((r) => r.status === 'rejected').length;

			return {
				total: pendingApplications.length,
				succeeded,
				failed
			};
		})
});
