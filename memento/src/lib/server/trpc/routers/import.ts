import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { importDocument } from '../../services/documents';

/**
 * Import Router
 * Handles document imports into workspaces
 *
 * ═══════════════════════════════════════════════════════════════════
 * PRIMARY ATTACK VECTOR
 * This is the main entry point for memory poisoning attacks.
 * Imported documents are processed without sanitization, and
 * hidden content becomes permanent AI memory.
 * ═══════════════════════════════════════════════════════════════════
 */
export const importRouter = router({
  /**
   * Import a document (DOCX, HTML, Markdown, TXT)
   *
   * VULNERABILITY: Processes document content without distinguishing
   * between visible and hidden content. All extracted text is sent
   * to AI for memory extraction.
   */
  document: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string().cuid(),
        fileName: z.string(),
        fileContent: z.string(), // Base64 encoded file content
        fileType: z.enum(['docx', 'html', 'md', 'txt']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Decode file content
      const buffer = Buffer.from(input.fileContent, 'base64');

      // Create a File-like object
      const file = {
        name: input.fileName,
        type: getContentType(input.fileType),
        buffer,
      };

      // Import document - this processes content for memory
      return importDocument(ctx.user.id, input.workspaceId, file);
    }),
});

/**
 * Helper to get content type from file extension
 */
function getContentType(fileType: string): string {
  const types: Record<string, string> = {
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    html: 'text/html',
    md: 'text/markdown',
    txt: 'text/plain',
  };

  return types[fileType] || 'application/octet-stream';
}
