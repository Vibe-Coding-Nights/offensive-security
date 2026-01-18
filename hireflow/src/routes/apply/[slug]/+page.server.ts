/**
 * Public Job Application Page Data Loading
 *
 * Loads job details for the public application form.
 * This is an unauthenticated route.
 */

import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { triggerAnalysis } from '$lib/server/services/analysis';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	// Find job by publicSlug (public - no auth required)
	const job = await db.job.findFirst({
		where: {
			publicSlug: slug,
			status: 'ACTIVE'
		},
		include: {
			org: {
				select: {
					name: true
				}
			}
		}
	});

	if (!job) {
		throw error(404, 'Job not found or no longer accepting applications');
	}

	return {
		job: {
			id: job.id,
			title: job.title,
			description: job.description,
			requirements: job.requirements,
			location: job.location,
			salaryMin: job.salaryMin,
			salaryMax: job.salaryMax,
			org: {
				name: job.org.name
			}
		}
	};
};

export const actions: Actions = {
	/**
	 * Handle resume submission
	 */
	default: async ({ request, params }) => {
		const { slug } = params;

		// Get job
		const job = await db.job.findFirst({
			where: { publicSlug: slug, status: 'ACTIVE' }
		});

		if (!job) {
			return { success: false, message: 'Job not found' };
		}

		// Parse form data
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const phone = formData.get('phone') as string | null;
		const linkedin = formData.get('linkedin') as string | null;
		const portfolio = formData.get('portfolio') as string | null;
		const coverLetter = formData.get('coverLetter') as string | null;
		const resumeFile = formData.get('resume') as File | null;

		if (!name || !email || !resumeFile) {
			return { success: false, message: 'Missing required fields' };
		}

		// Extract text from resume for analysis
		let resumeText = '';
		try {
			const buffer = Buffer.from(await resumeFile.arrayBuffer());
			if (resumeFile.name.endsWith('.pdf')) {
				const pdfParse = (await import('pdf-parse')).default;
				const data = await pdfParse(buffer);
				resumeText = data.text;
			} else if (resumeFile.name.endsWith('.docx') || resumeFile.name.endsWith('.doc')) {
				const mammoth = await import('mammoth');
				const result = await mammoth.extractRawText({ buffer });
				resumeText = result.value;
			} else if (resumeFile.name.endsWith('.txt')) {
				// Plain text - read directly
				resumeText = buffer.toString('utf-8');
			}
		} catch (e) {
			console.error('Failed to extract resume text:', e);
		}

		// Create application
		const application = await db.application.create({
			data: {
				candidateName: name,
				candidateEmail: email,
				candidatePhone: phone,
				linkedinUrl: linkedin,
				portfolioUrl: portfolio,
				coverLetter,
				resumeUrl: `s3://hireflow-resumes/pending/${Date.now()}-${resumeFile.name}`,
				resumeFilename: resumeFile.name,
				resumeText,
				analysisStatus: 'PENDING',
				stage: 'NEW',
				jobId: job.id
			}
		});

		// Log activity
		await db.activity.create({
			data: {
				applicationId: application.id,
				action: 'APPLICATION_SUBMITTED'
			}
		});

		// Trigger AI analysis
		triggerAnalysis(application.id).catch((err) => {
			console.error('Analysis trigger failed:', err);
		});

		return {
			success: true,
			message: 'Application submitted successfully',
			applicationId: application.id
		};
	}
};
