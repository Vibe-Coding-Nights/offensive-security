import mammoth from 'mammoth';
import { JSDOM } from 'jsdom';
import { createNote } from './notes';
import { processDocumentForMemory } from './memory';

/**
 * Document Import Service
 * Handles importing documents from various formats
 *
 * ═══════════════════════════════════════════════════════════════════
 * PRIMARY ATTACK ENTRY POINT
 * This service extracts text from documents WITHOUT sanitization.
 * Hidden content (white text, 0px font, HTML comments, etc.) is
 * included in the extraction and sent to memory processing.
 * ═══════════════════════════════════════════════════════════════════
 */

export interface ImportedFile {
  name: string;
  type: string;
  buffer: Buffer;
}

/**
 * Import a document and add to workspace
 *
 * VULNERABILITY: Processes document content without distinguishing
 * between visible and hidden content. All text is extracted and
 * passed to memory processing.
 */
export async function importDocument(
  userId: string,
  workspaceId: string,
  file: ImportedFile
): Promise<{ noteId: string }> {
  let plainText: string;
  let content: any;

  // Extract content based on file type
  if (file.name.endsWith('.docx')) {
    const extracted = await extractDocx(file.buffer);
    plainText = extracted.plainText;
    content = extracted.content;
  } else if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
    const extracted = extractHtml(file.buffer);
    plainText = extracted.plainText;
    content = extracted.content;
  } else if (file.name.endsWith('.md')) {
    plainText = extractMarkdown(file.buffer);
    content = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: plainText }] }] };
  } else if (file.name.endsWith('.txt')) {
    plainText = file.buffer.toString('utf-8');
    content = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: plainText }] }] };
  } else {
    throw new Error('Unsupported file type');
  }

  // Create note from imported content
  const note = await createNote({
    workspaceId,
    title: file.name.replace(/\.[^.]+$/, ''),
    content,
    createdById: userId,
  });

  // ═══════════════════════════════════════════════════════════════════
  // VULNERABILITY: Document content processed for memory extraction
  // Raw text (including hidden content) is sent to AI
  // Any "preferences" or "instructions" become permanent memories
  // ═══════════════════════════════════════════════════════════════════
  await processDocumentForMemory(userId, workspaceId, plainText, note.id);

  return { noteId: note.id };
}

/**
 * Extract text from DOCX file
 *
 * VULNERABILITY: mammoth.extractRawText() extracts ALL text,
 * including text that is:
 * - Formatted as white on white
 * - Set to 0px or 1px font size
 * - Hidden with CSS display: none
 * - In hidden paragraphs
 */
async function extractDocx(
  buffer: Buffer
): Promise<{ plainText: string; content: any }> {
  // ═══════════════════════════════════════════════════════════════════
  // VULNERABILITY: extractRawText gets ALL text content
  // No filtering of hidden or invisible content
  // ═══════════════════════════════════════════════════════════════════
  const textResult = await mammoth.extractRawText({ buffer });
  const plainText = textResult.value;

  // Also get HTML for richer content
  const htmlResult = await mammoth.convertToHtml({ buffer });
  const dom = new JSDOM(htmlResult.value);

  // Convert to TipTap-compatible structure (simplified)
  const content = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: plainText,
          },
        ],
      },
    ],
  };

  return { plainText, content };
}

/**
 * Extract text from HTML file
 *
 * VULNERABILITY: textContent extracts text from ALL elements,
 * including:
 * - Elements with display: none
 * - Elements with visibility: hidden
 * - White text on white background
 * - 0px font sizes
 * - HTML comments (preserved in some cases)
 */
function extractHtml(
  buffer: Buffer
): { plainText: string; content: any } {
  const html = buffer.toString('utf-8');
  const dom = new JSDOM(html);

  // ═══════════════════════════════════════════════════════════════════
  // VULNERABILITY: textContent includes text from hidden elements
  // No CSS evaluation or visibility filtering
  // ═══════════════════════════════════════════════════════════════════
  const plainText = dom.window.document.body.textContent || '';

  // Convert to TipTap structure (simplified)
  const content = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: plainText.trim(),
          },
        ],
      },
    ],
  };

  return { plainText: plainText.trim(), content };
}

/**
 * Extract text from Markdown file
 *
 * VULNERABILITY: Markdown comments <!-- --> are included in the text.
 * Invisible Unicode characters and zero-width spaces are preserved.
 */
function extractMarkdown(buffer: Buffer): string {
  // ═══════════════════════════════════════════════════════════════════
  // VULNERABILITY: Raw text extraction
  // HTML comments in markdown are kept as plain text
  // Zero-width characters and other invisible content preserved
  // ═══════════════════════════════════════════════════════════════════
  return buffer.toString('utf-8');
}

/**
 * What a secure implementation would look like (for reference):
 *
 * async function extractDocxSecure(buffer: Buffer): Promise<string> {
 *   const result = await mammoth.extractRawText({ buffer });
 *
 *   // SECURE: Parse document structure to identify hidden content
 *   const structureResult = await mammoth.convertToHtml({
 *     buffer,
 *     styleMap: [
 *       "p[style-name='Hidden'] => " // Detect hidden paragraphs
 *     ]
 *   });
 *
 *   // SECURE: Filter out:
 *   // - Text with white/transparent color
 *   // - Text with 0px or 1px font size
 *   // - Content from hidden elements
 *   // - Suspicious patterns (e.g., "USER PREFERENCE UPDATE")
 *
 *   return sanitizedText;
 * }
 *
 * async function processDocumentSecure(text: string, noteId: string): Promise<void> {
 *   const memories = await extractMemories(text);
 *
 *   // SECURE: Mark document-derived memories as low-trust
 *   for (const memory of memories) {
 *     if (looksLikePreference(memory)) {
 *       // SECURE: Queue for user confirmation
 *       await queueMemoryConfirmation({
 *         content: memory,
 *         source: 'document',
 *         sourceId: noteId,
 *         trustLevel: 'low',
 *         requiresConfirmation: true
 *       });
 *     }
 *   }
 * }
 */
