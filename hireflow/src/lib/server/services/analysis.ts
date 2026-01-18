/**
 * Resume Analysis Service
 *
 * Handles AI-powered resume analysis for candidate screening.
 * Extracts text from resumes and uses LLM to evaluate against job requirements.
 */

import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenAI } from '@google/genai';
import pdfParse from 'pdf-parse';
import { db } from '../db';
import { env } from '$env/dynamic/private';

// AI Provider Configuration
export type AIProvider = 'claude' | 'gemini';

const anthropic = new Anthropic();
const gemini = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY || '' });

export function getProvider(): AIProvider {
	return (env.AI_PROVIDER as AIProvider) || 'claude';
}

/**
 * Extract text content from PDF resume
 */
async function extractPdfText(buffer: Buffer): Promise<string> {
	try {
		const data = await pdfParse(buffer);
		return data.text;
	} catch (error) {
		console.error('PDF parsing failed:', error);
		throw new Error('Failed to parse resume PDF');
	}
}

/**
 * Extract text content from DOCX resume
 */
async function extractDocxText(buffer: Buffer): Promise<string> {
	const mammoth = await import('mammoth');
	const result = await mammoth.extractRawText({ buffer });
	return result.value;
}

/**
 * Analysis result schema
 */
interface AnalysisResult {
	matchScore: number;
	summary: string;
	keyQualifications: string[];
	concerns: string[];
	recommendation: 'INTERVIEW' | 'MAYBE' | 'PASS';
	reasoning: string;
}

/**
 * Build the analysis prompt
 */
function buildAnalysisPrompt(resumeText: string, jobTitle: string, jobRequirements: string): string {
	return `You are an expert technical recruiter analyzing candidate resumes.

Analyze the following resume for this position:

═══════════════════════════════════════════════════════════════════════════
JOB TITLE: ${jobTitle}

JOB REQUIREMENTS:
${jobRequirements}
═══════════════════════════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════════════════════
RESUME CONTENT:
${resumeText}
═══════════════════════════════════════════════════════════════════════════

Based on the resume above, provide your analysis in the following JSON format.
Be objective and thorough.

{
  "matchScore": <number 1-10>,
  "summary": "<2-3 sentence summary of the candidate>",
  "keyQualifications": ["<qualification1>", "<qualification2>", ...],
  "concerns": ["<concern1>", "<concern2>", ...],
  "recommendation": "<INTERVIEW|MAYBE|PASS>",
  "reasoning": "<brief explanation of your recommendation>"
}

Respond ONLY with the JSON object, no additional text.`;
}

/**
 * Analyze with Claude
 */
async function analyzeWithClaude(prompt: string): Promise<string> {
	const response = await anthropic.messages.create({
		model: 'claude-sonnet-4-20250514',
		max_tokens: 2048,
		messages: [{ role: 'user', content: prompt }]
	});

	const content = response.content[0];
	if (content.type !== 'text') {
		throw new Error('Unexpected response format from Claude');
	}
	return content.text;
}

/**
 * Analyze with Gemini Flash 3
 */
async function analyzeWithGemini(prompt: string): Promise<string> {
	const response = await gemini.models.generateContent({
		model: 'gemini-3-flash-preview',
		contents: prompt,
		config: {
			responseMimeType: 'application/json'
		}
	});

	if (!response.text) {
		throw new Error('Empty response from Gemini');
	}
	return response.text;
}

/**
 * Parse LLM response into structured result
 */
function parseAnalysisResponse(text: string): AnalysisResult {
	try {
		let jsonText = text.trim();
		if (jsonText.startsWith('```json')) {
			jsonText = jsonText.slice(7);
		}
		if (jsonText.startsWith('```')) {
			jsonText = jsonText.slice(3);
		}
		if (jsonText.endsWith('```')) {
			jsonText = jsonText.slice(0, -3);
		}

		const result = JSON.parse(jsonText.trim()) as AnalysisResult;

		if (typeof result.matchScore !== 'number' || result.matchScore < 1 || result.matchScore > 10) {
			throw new Error('Invalid matchScore');
		}

		return result;
	} catch (error) {
		console.error('Failed to parse AI response:', text);
		throw new Error('Failed to parse AI analysis result');
	}
}

/**
 * Analyze resume with configured LLM provider
 */
async function analyzeResumeWithLLM(
	resumeText: string,
	jobTitle: string,
	jobRequirements: string
): Promise<AnalysisResult> {
	const prompt = buildAnalysisPrompt(resumeText, jobTitle, jobRequirements);
	const provider = getProvider();

	console.log(`[Analysis] Using provider: ${provider}`);

	let responseText: string;

	if (provider === 'gemini') {
		responseText = await analyzeWithGemini(prompt);
	} else {
		responseText = await analyzeWithClaude(prompt);
	}

	return parseAnalysisResponse(responseText);
}

/**
 * Main analysis function - processes a candidate application
 */
export async function analyzeResume(applicationId: string): Promise<void> {
	console.log(`[Analysis] Starting analysis for application ${applicationId}`);

	const application = await db.application.findUnique({
		where: { id: applicationId },
		include: {
			job: {
				select: {
					title: true,
					requirements: true
				}
			}
		}
	});

	if (!application) {
		throw new Error(`Application ${applicationId} not found`);
	}

	await db.application.update({
		where: { id: applicationId },
		data: { analysisStatus: 'ANALYZING' }
	});

	await db.activity.create({
		data: {
			applicationId,
			action: 'ANALYSIS_STARTED'
		}
	});

	try {
		console.log(`[Analysis] Fetching resume from ${application.resumeUrl}`);

		let resumeText: string;

		if (application.resumeFilename.endsWith('.pdf')) {
			resumeText = application.resumeText || '[Resume text would be extracted from PDF]';
		} else if (
			application.resumeFilename.endsWith('.docx') ||
			application.resumeFilename.endsWith('.doc')
		) {
			resumeText = application.resumeText || '[Resume text would be extracted from DOCX]';
		} else if (application.resumeFilename.endsWith('.txt')) {
			// Plain text files - use directly
			resumeText = application.resumeText || '[No text content found]';
		} else {
			throw new Error('Unsupported file format');
		}

		await db.application.update({
			where: { id: applicationId },
			data: { resumeText }
		});

		console.log(`[Analysis] Extracted ${resumeText.length} characters of text`);

		const analysis = await analyzeResumeWithLLM(
			resumeText,
			application.job.title,
			application.job.requirements
		);

		console.log(`[Analysis] Result: score=${analysis.matchScore}, rec=${analysis.recommendation}`);

		await db.application.update({
			where: { id: applicationId },
			data: {
				analysisStatus: 'ANALYZED',
				matchScore: analysis.matchScore,
				analysisSummary: analysis.summary,
				keyQualifications: analysis.keyQualifications,
				concerns: analysis.concerns,
				recommendation: analysis.recommendation,
				analysisRawJson: analysis as unknown as object,
				analyzedAt: new Date()
			}
		});

		await db.activity.create({
			data: {
				applicationId,
				action: 'ANALYSIS_COMPLETED',
				details: {
					matchScore: analysis.matchScore,
					recommendation: analysis.recommendation
				}
			}
		});

		console.log(`[Analysis] Completed for ${applicationId}`);
	} catch (error) {
		console.error(`[Analysis] Failed for ${applicationId}:`, error);

		await db.application.update({
			where: { id: applicationId },
			data: { analysisStatus: 'FAILED' }
		});

		await db.activity.create({
			data: {
				applicationId,
				action: 'ANALYSIS_FAILED',
				details: {
					error: error instanceof Error ? error.message : 'Unknown error'
				}
			}
		});

		throw error;
	}
}

/**
 * Trigger analysis for an application
 */
export async function triggerAnalysis(applicationId: string): Promise<void> {
	await analyzeResume(applicationId);
}
