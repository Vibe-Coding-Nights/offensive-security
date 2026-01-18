import { z } from 'zod';
import { router, protectedProcedure, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

/**
 * Jobs Router
 *
 * Handles job posting CRUD operations
 */
export const jobsRouter = router({
	/**
	 * List all jobs for the current organization
	 */
	list: protectedProcedure
		.input(
			z
				.object({
					status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'CLOSED']).optional(),
					limit: z.number().min(1).max(100).default(50),
					cursor: z.string().optional()
				})
				.optional()
		)
		.query(async ({ ctx, input }) => {
			const jobs = await ctx.db.job.findMany({
				where: {
					orgId: ctx.user.orgId,
					...(input?.status && { status: input.status })
				},
				include: {
					_count: {
						select: { applications: true }
					}
				},
				orderBy: { createdAt: 'desc' },
				take: input?.limit ?? 50,
				...(input?.cursor && {
					cursor: { id: input.cursor },
					skip: 1
				})
			});

			return {
				jobs,
				nextCursor: jobs.length === (input?.limit ?? 50) ? jobs[jobs.length - 1]?.id : undefined
			};
		}),

	/**
	 * Get a single job with application stats
	 */
	get: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
		const job = await ctx.db.job.findFirst({
			where: {
				id: input.id,
				orgId: ctx.user.orgId
			},
			include: {
				_count: {
					select: { applications: true }
				},
				createdBy: {
					select: { id: true, name: true, avatarUrl: true }
				}
			}
		});

		if (!job) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'Job not found'
			});
		}

		// Get stage breakdown
		const stageBreakdown = await ctx.db.application.groupBy({
			by: ['stage'],
			where: { jobId: input.id },
			_count: true
		});

		// Get score distribution
		const scoreDistribution = await ctx.db.application.groupBy({
			by: ['matchScore'],
			where: {
				jobId: input.id,
				matchScore: { not: null }
			},
			_count: true
		});

		return {
			...job,
			stageBreakdown: Object.fromEntries(stageBreakdown.map((s) => [s.stage, s._count])),
			scoreDistribution: Object.fromEntries(
				scoreDistribution.map((s) => [s.matchScore, s._count])
			)
		};
	}),

	/**
	 * Get public job details (for application page)
	 */
	getPublic: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ ctx, input }) => {
			const job = await ctx.db.job.findFirst({
				where: {
					publicSlug: input.slug,
					status: 'ACTIVE'
				},
				select: {
					id: true,
					title: true,
					description: true,
					requirements: true,
					location: true,
					salaryMin: true,
					salaryMax: true,
					employmentType: true,
					org: {
						select: {
							name: true,
							logoUrl: true
						}
					}
				}
			});

			if (!job) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Job not found or no longer accepting applications'
				});
			}

			return job;
		}),

	/**
	 * Create a new job
	 */
	create: protectedProcedure
		.input(
			z.object({
				title: z.string().min(1).max(200),
				description: z.string().min(1),
				requirements: z.string().min(1),
				location: z.string().optional(),
				salaryMin: z.number().optional(),
				salaryMax: z.number().optional(),
				employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']).default('FULL_TIME'),
				status: z.enum(['DRAFT', 'ACTIVE']).default('DRAFT')
			})
		)
		.mutation(async ({ ctx, input }) => {
			const job = await ctx.db.job.create({
				data: {
					...input,
					orgId: ctx.user.orgId,
					createdById: ctx.user.id
				}
			});

			// Log activity
			await ctx.db.activity.create({
				data: {
					userId: ctx.user.id,
					action: 'JOB_CREATED',
					details: { jobId: job.id, title: job.title }
				}
			});

			return job;
		}),

	/**
	 * Update a job
	 */
	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				title: z.string().min(1).max(200).optional(),
				description: z.string().min(1).optional(),
				requirements: z.string().min(1).optional(),
				location: z.string().optional(),
				salaryMin: z.number().optional(),
				salaryMax: z.number().optional(),
				employmentType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']).optional(),
				status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'CLOSED']).optional()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { id, ...data } = input;

			// Verify ownership
			const existing = await ctx.db.job.findFirst({
				where: { id, orgId: ctx.user.orgId }
			});

			if (!existing) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Job not found'
				});
			}

			const job = await ctx.db.job.update({
				where: { id },
				data: {
					...data,
					...(data.status === 'CLOSED' && { closedAt: new Date() })
				}
			});

			// Log activity
			await ctx.db.activity.create({
				data: {
					userId: ctx.user.id,
					action: 'JOB_UPDATED',
					details: { jobId: job.id, changes: Object.keys(data) }
				}
			});

			return job;
		}),

	/**
	 * Delete a job (soft delete by closing)
	 */
	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			// Verify ownership
			const existing = await ctx.db.job.findFirst({
				where: { id: input.id, orgId: ctx.user.orgId }
			});

			if (!existing) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Job not found'
				});
			}

			await ctx.db.job.update({
				where: { id: input.id },
				data: {
					status: 'CLOSED',
					closedAt: new Date()
				}
			});

			await ctx.db.activity.create({
				data: {
					userId: ctx.user.id,
					action: 'JOB_CLOSED',
					details: { jobId: input.id }
				}
			});

			return { success: true };
		})
});
