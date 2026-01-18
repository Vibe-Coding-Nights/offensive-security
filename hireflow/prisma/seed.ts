/**
 * Database Seed Script
 *
 * Creates demo data for development and testing.
 * Run with: npm run db:seed
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Simple password hash for demo (in production, use the auth.ts hash function)
function demoHash(password: string): string {
	// For demo purposes only - just base64 encode
	// In production, use proper PBKDF2 from auth.ts
	return Buffer.from(`demo:${password}`).toString('base64');
}

async function main() {
	console.log('Seeding database...\n');

	// Clean existing data
	await prisma.activity.deleteMany();
	await prisma.application.deleteMany();
	await prisma.job.deleteMany();
	await prisma.session.deleteMany();
	await prisma.user.deleteMany();
	await prisma.organization.deleteMany();

	// Create demo organization
	const org = await prisma.organization.create({
		data: {
			name: 'Acme Corp',
			slug: 'acme-corp'
		}
	});
	console.log('Created organization:', org.name);

	// Create demo users
	const recruiter = await prisma.user.create({
		data: {
			email: 'recruiter@acme.com',
			name: 'Alex Recruiter',
			hashedPassword: demoHash('password123'),
			role: 'MEMBER',
			orgId: org.id
		}
	});
	console.log('Created user:', recruiter.email);

	const admin = await prisma.user.create({
		data: {
			email: 'admin@acme.com',
			name: 'Jordan Admin',
			hashedPassword: demoHash('password123'),
			role: 'ADMIN',
			orgId: org.id
		}
	});
	console.log('Created user:', admin.email);

	// Create demo jobs
	const frontendJob = await prisma.job.create({
		data: {
			title: 'Senior Frontend Engineer',
			publicSlug: 'senior-frontend-engineer',
			description: `We're looking for an experienced frontend engineer to join our team and help build the next generation of our product.

You'll work on:
- Building responsive, accessible user interfaces
- Collaborating with designers and backend engineers
- Improving performance and developer experience
- Mentoring junior developers

We offer competitive compensation, flexible remote work, and a great team culture.`,
			requirements: `Required:
- 5+ years of frontend development experience
- Strong proficiency in React, Vue, or Svelte
- Experience with TypeScript
- Understanding of modern CSS and responsive design
- Excellent communication skills
- Experience with testing frameworks (Jest, Cypress)

Nice to have:
- Experience with SvelteKit or Next.js
- GraphQL or tRPC experience
- Design system experience
- Open source contributions`,
			location: 'Remote',
			salaryMin: 150000,
			salaryMax: 200000,
			status: 'ACTIVE',
			orgId: org.id,
			createdById: recruiter.id
		}
	});
	console.log('Created job:', frontendJob.title);

	const backendJob = await prisma.job.create({
		data: {
			title: 'Backend Engineer',
			publicSlug: 'backend-engineer',
			description: `Join our backend team to build scalable APIs and services that power our platform.

Responsibilities:
- Design and implement RESTful and GraphQL APIs
- Work with PostgreSQL and Redis
- Build event-driven microservices
- Ensure high availability and performance`,
			requirements: `Required:
- 3+ years backend development experience
- Strong Node.js or Python experience
- PostgreSQL experience
- Understanding of distributed systems

Nice to have:
- Kubernetes experience
- Message queue experience (RabbitMQ, Kafka)
- Go or Rust experience`,
			location: 'Remote / San Francisco',
			salaryMin: 140000,
			salaryMax: 180000,
			status: 'ACTIVE',
			orgId: org.id,
			createdById: recruiter.id
		}
	});
	console.log('Created job:', backendJob.title);

	// Create demo applications with various scores
	const applications = [
		{
			candidateName: 'Sarah Chen',
			candidateEmail: 'sarah.chen@email.com',
			matchScore: 9,
			recommendation: 'INTERVIEW' as const,
			stage: 'SCREENING' as const,
			resumeUrl: 's3://hireflow-resumes/demo/sarah-chen.pdf',
			resumeFilename: 'sarah-chen-resume.pdf',
			resumeText: `SARAH CHEN
Senior Frontend Engineer

EXPERIENCE
Senior Frontend Engineer at TechCorp (2020-Present)
- Led redesign of customer dashboard serving 1M+ users
- Implemented design system reducing development time by 40%
- Mentored team of 4 junior developers

Frontend Developer at StartupXYZ (2017-2020)
- Built React components for e-commerce platform
- Integrated GraphQL APIs with Apollo Client
- Achieved 95% test coverage with Jest and Cypress

EDUCATION
BS Computer Science, Stanford University (2017)

SKILLS
React, TypeScript, SvelteKit, GraphQL, Jest, Cypress, Tailwind CSS`,
			analysisSummary:
				'Strong frontend experience with React and TypeScript. Led major projects at previous company. Excellent communication skills evidenced by mentorship experience.',
			keyQualifications: [
				'7+ years frontend experience',
				'TypeScript expertise',
				'Team leadership',
				'Design system experience'
			],
			concerns: ['No direct Svelte experience, but SvelteKit mentioned'],
			job: frontendJob
		},
		{
			candidateName: 'Marcus Johnson',
			candidateEmail: 'marcus.j@email.com',
			matchScore: 7,
			recommendation: 'INTERVIEW' as const,
			stage: 'NEW' as const,
			resumeUrl: 's3://hireflow-resumes/demo/marcus-johnson.pdf',
			resumeFilename: 'marcus-johnson-resume.pdf',
			resumeText: `MARCUS JOHNSON
Frontend Developer

EXPERIENCE
Frontend Developer at MediaCo (2019-Present)
- Built Vue.js components for content management system
- Worked with REST APIs and Vuex state management
- Participated in agile development process

Junior Developer at WebAgency (2017-2019)
- Created responsive websites using HTML, CSS, JavaScript
- Learned React and modern build tools

EDUCATION
BA Information Systems, UCLA (2017)

SKILLS
Vue.js, React, JavaScript, TypeScript (learning), CSS, REST APIs`,
			analysisSummary:
				'Solid background in web development. Some gaps in modern frameworks but shows strong learning ability and progression.',
			keyQualifications: ['5 years experience', 'Vue.js proficiency', 'React experience'],
			concerns: [
				'TypeScript listed as learning',
				'No mention of testing frameworks',
				'No leadership experience yet'
			],
			job: frontendJob
		},
		{
			candidateName: 'Emily Rodriguez',
			candidateEmail: 'emily.r@email.com',
			matchScore: 6,
			recommendation: 'MAYBE' as const,
			stage: 'SCREENING' as const,
			resumeUrl: 's3://hireflow-resumes/demo/emily-rodriguez.pdf',
			resumeFilename: 'emily-rodriguez-resume.pdf',
			resumeText: `EMILY RODRIGUEZ
Web Developer

EXPERIENCE
Web Developer at LocalBiz (2022-Present)
- Maintain WordPress websites for small businesses
- Create custom themes using PHP and JavaScript
- Handle client communications

Intern at TechStartup (2021-2022)
- Assisted with React component development
- Wrote documentation for API endpoints

EDUCATION
BS Computer Science, State University (2021)
Bootcamp Certificate, Code Academy (2020)

SKILLS
JavaScript, React basics, HTML, CSS, WordPress, PHP`,
			analysisSummary:
				'Junior-mid level experience. Good potential but may need mentorship. Strong academic background.',
			keyQualifications: ['CS degree', 'React exposure', 'Good communication with clients'],
			concerns: [
				'Only 3 years experience (need 5+)',
				'No TypeScript',
				'Limited modern framework depth',
				'No testing mentioned'
			],
			job: frontendJob
		},
		{
			candidateName: 'Alex Kim',
			candidateEmail: 'alex.kim@email.com',
			matchScore: 4,
			recommendation: 'PASS' as const,
			stage: 'NEW' as const,
			resumeUrl: 's3://hireflow-resumes/demo/alex-kim.pdf',
			resumeFilename: 'alex-kim-resume.pdf',
			resumeText: `ALEX KIM
Software Engineer

EXPERIENCE
Backend Engineer at DataCorp (2020-Present)
- Built Python microservices with FastAPI
- Managed PostgreSQL databases
- Worked with Kubernetes deployments

Junior Developer at Consulting Firm (2018-2020)
- Java enterprise development
- Oracle database management

EDUCATION
MS Computer Science, MIT (2018)

SKILLS
Python, Java, PostgreSQL, Kubernetes, Docker, FastAPI`,
			analysisSummary:
				'Experience primarily in backend. Limited frontend exposure. Better fit for backend roles.',
			keyQualifications: ['Strong backend skills', 'Advanced degree', 'Cloud experience'],
			concerns: [
				'No frontend framework experience',
				'No JavaScript/TypeScript',
				'No CSS or responsive design',
				'Misaligned with frontend role'
			],
			job: frontendJob
		}
	];

	for (const app of applications) {
		const created = await prisma.application.create({
			data: {
				candidateName: app.candidateName,
				candidateEmail: app.candidateEmail,
				resumeUrl: app.resumeUrl,
				resumeFilename: app.resumeFilename,
				resumeText: app.resumeText,
				analysisStatus: 'ANALYZED',
				matchScore: app.matchScore,
				analysisSummary: app.analysisSummary,
				keyQualifications: app.keyQualifications,
				concerns: app.concerns,
				recommendation: app.recommendation,
				stage: app.stage,
				jobId: app.job.id,
				analyzedAt: new Date()
			}
		});
		console.log(`Created application: ${created.candidateName} (Score: ${created.matchScore})`);
	}

	// Create activity log entries
	const sarahApp = await prisma.application.findFirst({
		where: { candidateEmail: 'sarah.chen@email.com' }
	});

	if (sarahApp) {
		await prisma.activity.createMany({
			data: [
				{
					applicationId: sarahApp.id,
					userId: recruiter.id,
					action: 'APPLICATION_SUBMITTED'
				},
				{
					applicationId: sarahApp.id,
					action: 'ANALYSIS_COMPLETED',
					details: { matchScore: 9, recommendation: 'INTERVIEW' }
				}
			]
		});
	}
	console.log('Created activity log entries');

	console.log('\n--- SEED COMPLETE ---');
	console.log('\nDemo credentials:');
	console.log('  Email: recruiter@acme.com');
	console.log('  Password: password123');
	console.log('\nAdmin credentials:');
	console.log('  Email: admin@acme.com');
	console.log('  Password: password123');
	console.log('\nJob posting slug: senior-frontend-engineer');
	console.log('Apply URL: http://localhost:5173/apply/senior-frontend-engineer');
}

main()
	.catch((e) => {
		console.error('Seed failed:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
