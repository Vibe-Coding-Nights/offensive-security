/**
 * File Storage Service
 *
 * Handles resume uploads to S3-compatible storage.
 * In production, this would use AWS S3, R2, or MinIO.
 */

import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '$env/dynamic/private';

// Initialize S3 client (would use real credentials in production)
const s3Client = new S3Client({
	region: env.S3_REGION || 'us-east-1',
	endpoint: env.S3_ENDPOINT,
	credentials: {
		accessKeyId: env.S3_ACCESS_KEY || '',
		secretAccessKey: env.S3_SECRET_KEY || ''
	},
	forcePathStyle: true // Required for MinIO
});

const BUCKET = env.S3_BUCKET || 'hireflow-resumes';

/**
 * Upload a resume file to S3
 *
 * Returns the URL of the uploaded file.
 */
export async function uploadResume(
	file: File,
	applicationId: string
): Promise<string> {
	const key = `resumes/${applicationId}/${file.name}`;

	const buffer = await file.arrayBuffer();

	await s3Client.send(
		new PutObjectCommand({
			Bucket: BUCKET,
			Key: key,
			Body: new Uint8Array(buffer),
			ContentType: file.type,
			Metadata: {
				applicationId,
				originalName: file.name
			}
		})
	);

	// Return the S3 key (or full URL depending on setup)
	return `s3://${BUCKET}/${key}`;
}

/**
 * Get a presigned URL for downloading a resume
 */
export async function getResumeDownloadUrl(s3Url: string): Promise<string> {
	const key = s3Url.replace(`s3://${BUCKET}/`, '');

	const command = new GetObjectCommand({
		Bucket: BUCKET,
		Key: key
	});

	const url = await getSignedUrl(s3Client, command, {
		expiresIn: 3600 // 1 hour
	});

	return url;
}

/**
 * Fetch resume content as a buffer (for text extraction)
 */
export async function fetchResumeBuffer(s3Url: string): Promise<Buffer> {
	const key = s3Url.replace(`s3://${BUCKET}/`, '');

	const response = await s3Client.send(
		new GetObjectCommand({
			Bucket: BUCKET,
			Key: key
		})
	);

	if (!response.Body) {
		throw new Error('Empty response body');
	}

	// Convert stream to buffer
	const chunks: Uint8Array[] = [];
	const reader = response.Body.transformToWebStream().getReader();

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		chunks.push(value);
	}

	return Buffer.concat(chunks);
}
