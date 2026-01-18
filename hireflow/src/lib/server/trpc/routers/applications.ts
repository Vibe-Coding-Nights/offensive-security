import { z } from 'zod';
import { router, protectedProcedure, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

/**
 * Applications Router
 *
 * Handles candidate application management
 */
export const applicationsRouter = router({
	/**
	 * List recent applications across all jobs (for dashboard)
	 */
	list: protectedProcedure
		.input(
			z
				.object({
					limit: z.number().min(1).max(100).default(50)
				})
				.optional()
		)
		.query(async ({ ctx, input }) => {
			const applications = await ctx.db.application.findMany({
				where: {
					job: {
						orgId: ctx.user.orgId
					}
				},
				include: {
					job: {
						select: {
							id: true,
							title: true
						}
					}
				},
				orderBy: { createdAt: 'desc' },
				take: input?.limit ?? 50
			});

			return {
				applications
			};
		}),

	/**
	 * List applications for a specific job
	 */
	listByJob: protectedProcedure
		.input(
			z.object({
				jobId: z.string(),
				stage: z
					.enum([
						'NEW',
						'SCREENING',
						'PHONE_SCREEN',
						'INTERVIEW',
						'TECHNICAL',
						'ONSITE',
						'OFFER',
						'HIRED',
						'REJECTED',
						'WITHDRAWN'
					])
					.optional(),
				recommendation: z.enum(['INTERVIEW', 'MAYBE', 'PASS']).optional(),
				sortBy: z.enum(['score', 'date', 'name']).default('date'),
				sortOrder: z.enum(['asc', 'desc']).default('desc'),
				limit: z.number().min(1).max(100).default(50),
				cursor: z.string().optional()
			})
		)
		.query(async ({ ctx, input }) => {
			// Verify job belongs to org
			const job = await ctx.db.job.findFirst({
				where: { id: input.jobId, orgId: ctx.user.orgId }
			});

			if (!job) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Job not found'
				});
			}

			const orderBy: Record<string, 'asc' | 'desc'> =
				input.sortBy === 'score'
					? { matchScore: input.sortOrder }
					: input.sortBy === 'name'
						? { candidateName: input.sortOrder }
						: { createdAt: input.sortOrder };

			const applications = await ctx.db.application.findMany({
				where: {
					jobId: input.jobId,
					...(input.stage && { stage: input.stage }),
					...(input.recommendation && { recommendation: input.recommendation })
				},
				orderBy,
				take: input.limit,
				...(input.cursor && {
					cursor: { id: input.cursor },
					skip: 1
				})
			});

			return {
				applications,
				nextCursor:
					applications.length === input.limit
						? applications[applications.length - 1]?.id
						: undefined
			};
		}),

	/**
	 * Get a single application with full details
	 */
	get: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			const application = await ctx.db.application.findFirst({
				where: { id: input.id },
				include: {
					job: {
						select: {
							id: true,
							title: true,
							orgId: true
						}
					},
					activities: {
						orderBy: { createdAt: 'desc' },
						take: 20,
						include: {
							user: {
								select: { id: true, name: true, avatarUrl: true }
							}
						}
					}
				}
			});

			if (!application || application.job.orgId !== ctx.user.orgId) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Application not found'
				});
			}

			// Log view activity
			await ctx.db.activity.create({
				data: {
					applicationId: application.id,
					userId: ctx.user.id,
					action: 'APPLICATION_VIEWED'
				}
			});

			return application;
		}),

	/**
	 * Submit a new application (public endpoint)
	 * This is where candidates submit their resumes
	 */
	submit: publicProcedure
		.input(
			z.object({
				jobSlug: z.string(),
				candidateName: z.string().min(1).max(200),
				candidateEmail: z.string().email(),
				candidatePhone: z.string().optional(),
				linkedinUrl: z.string().url().optional(),
				portfolioUrl: z.string().url().optional(),
				coverLetter: z.string().max(5000).optional(),
				resumeUrl: z.string(), // Pre-uploaded to S3
				resumeFilename: z.string(),
				source: z.string().optional()
			})
		)
		.mutation(async ({ ctx, input }) => {
			// Find the job
			const job = await ctx.db.job.findFirst({
				where: {
					publicSlug: input.jobSlug,
					status: 'ACTIVE'
				}
			});

			if (!job) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'This position is no longer accepting applications'
				});
			}

			// Check for duplicate application
			const existing = await ctx.db.application.findFirst({
				where: {
					jobId: job.id,
					candidateEmail: input.candidateEmail
				}
			});

			if (existing) {
				throw new TRPCError({
					code: 'CONFLICT',
					message: 'You have already applied for this position'
				});
			}

			// Create application
			const application = await ctx.db.application.create({
				data: {
					jobId: job.id,
					candidateName: input.candidateName,
					candidateEmail: input.candidateEmail,
					candidatePhone: input.candidatePhone,
					linkedinUrl: input.linkedinUrl,
					portfolioUrl: input.portfolioUrl,
					coverLetter: input.coverLetter,
					resumeUrl: input.resumeUrl,
					resumeFilename: input.resumeFilename,
					source: input.source,
					analysisStatus: 'PENDING'
				}
			});

			// Log activity
			await ctx.db.activity.create({
				data: {
					applicationId: application.id,
					action: 'APPLICATION_SUBMITTED',
					details: { source: input.source }
				}
			});

			// Note: In a real app, we'd queue the resume for analysis here
			// await analysisQueue.add('analyze', { applicationId: application.id });

			return {
				id: application.id,
				message: 'Application submitted successfully'
			};
		}),

	/**
	 * Update application stage
	 */
	updateStage: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				stage: z.enum([
					'NEW',
					'SCREENING',
					'PHONE_SCREEN',
					'INTERVIEW',
					'TECHNICAL',
					'ONSITE',
					'OFFER',
					'HIRED',
					'REJECTED',
					'WITHDRAWN'
				])
			})
		)
		.mutation(async ({ ctx, input }) => {
			const application = await ctx.db.application.findFirst({
				where: { id: input.id },
				include: { job: { select: { orgId: true } } }
			});

			if (!application || application.job.orgId !== ctx.user.orgId) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Application not found'
				});
			}

			const previousStage = application.stage;

			const updated = await ctx.db.application.update({
				where: { id: input.id },
				data: { stage: input.stage }
			});

			// Log activity
			await ctx.db.activity.create({
				data: {
					applicationId: input.id,
					userId: ctx.user.id,
					action: 'STAGE_CHANGED',
					details: {
						from: previousStage,
						to: input.stage
					}
				}
			});

			return updated;
		}),

	/**
	 * Add a note to an application
	 */
	addNote: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				note: z.string().min(1).max(5000)
			})
		)
		.mutation(async ({ ctx, input }) => {
			const application = await ctx.db.application.findFirst({
				where: { id: input.id },
				include: { job: { select: { orgId: true } } }
			});

			if (!application || application.job.orgId !== ctx.user.orgId) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Application not found'
				});
			}

			const updated = await ctx.db.application.update({
				where: { id: input.id },
				data: {
					notes: application.notes
						? `${application.notes}\n\n---\n\n${input.note}`
						: input.note
				}
			});

			await ctx.db.activity.create({
				data: {
					applicationId: input.id,
					userId: ctx.user.id,
					action: 'NOTE_ADDED',
					details: { noteLength: input.note.length }
				}
			});

			return updated;
		}),

	/**
	 * Set manual rating
	 */
	setRating: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				rating: z.number().min(1).max(5)
			})
		)
		.mutation(async ({ ctx, input }) => {
			const application = await ctx.db.application.findFirst({
				where: { id: input.id },
				include: { job: { select: { orgId: true } } }
			});

			if (!application || application.job.orgId !== ctx.user.orgId) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Application not found'
				});
			}

			const updated = await ctx.db.application.update({
				where: { id: input.id },
				data: { rating: input.rating }
			});

			await ctx.db.activity.create({
				data: {
					applicationId: input.id,
					userId: ctx.user.id,
					action: 'RATING_CHANGED',
					details: {
						previousRating: application.rating,
						newRating: input.rating
					}
				}
			});

			return updated;
		})
});
