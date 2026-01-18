/**
 * AI Client Factory
 * Centralized AI provider management with lazy initialization
 *
 * Usage:
 * ```typescript
 * import { getAIClient, getProvider } from '$lib/server/ai';
 *
 * const client = getAIClient();
 * const response = await client.chat(messages, { systemPrompt: '...' });
 * ```
 */

import type { AIProvider, AIProviderClient, ChatMessage, ChatOptions, ChatResponse } from './types';
import { claudeProvider } from './providers/claude';
import { geminiProvider } from './providers/gemini';

// Export types
export type { AIProvider, AIProviderClient, ChatMessage, ChatOptions, ChatResponse };
export type { MemoryExtractionRequest, MemoryExtractionResponse } from './types';

/**
 * Get the configured AI provider from environment
 */
export function getProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER as AIProvider;
  if (provider === 'gemini') return 'gemini';
  return 'claude'; // Default
}

/**
 * Get the AI client for the configured provider
 */
export function getAIClient(provider?: AIProvider): AIProviderClient {
  const targetProvider = provider || getProvider();

  switch (targetProvider) {
    case 'gemini':
      return geminiProvider;
    case 'claude':
    default:
      return claudeProvider;
  }
}

/**
 * Check if any AI provider is configured
 */
export function isAIConfigured(): boolean {
  return claudeProvider.isConfigured() || geminiProvider.isConfigured();
}

/**
 * Get all available (configured) providers
 */
export function getAvailableProviders(): AIProvider[] {
  const providers: AIProvider[] = [];
  if (claudeProvider.isConfigured()) providers.push('claude');
  if (geminiProvider.isConfigured()) providers.push('gemini');
  return providers;
}

/**
 * Simple helper for one-shot chat completion
 */
export async function chat(
  messages: ChatMessage[],
  options?: ChatOptions
): Promise<ChatResponse> {
  const client = getAIClient();
  return client.chat(messages, options);
}

/**
 * Extract memories from text content
 * Used by memory service for document and conversation processing
 */
export async function extractMemories(
  content: string,
  type: 'conversation' | 'document'
): Promise<string[]> {
  const systemPrompt = type === 'conversation'
    ? `You are a memory extraction system. Extract important information
from this conversation that should be remembered for future interactions.

Focus on:
- User preferences and settings
- Project context and decisions
- Key facts about the user's work
- Any instructions for future behavior

Output as a JSON array of memory strings. If there's nothing important to remember,
output an empty array.

Example output:
["User prefers TypeScript over JavaScript", "Working on a React project called Memento"]`
    : `Extract important information from this document that should be
remembered. Include any user preferences, project decisions, or context
that would be useful for future conversations.

Output as a JSON array of memory strings. If there's nothing important,
output an empty array.`;

  const userPrompt = type === 'conversation'
    ? `Conversation:\n${content}\n\nExtract memories as JSON array:`
    : `Document content:\n${content}\n\nExtract key information as JSON array:`;

  const client = getAIClient();
  const response = await client.chat(
    [{ role: 'user', content: userPrompt }],
    { systemPrompt, maxTokens: 1024 }
  );

  return parseMemories(response.content);
}

/**
 * Parse memories from AI response
 */
function parseMemories(content: string): string[] {
  try {
    // Try to extract JSON array from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed)) {
        return parsed.filter((item) => typeof item === 'string' && item.trim());
      }
    }

    // Fallback: split by newlines and filter
    return content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('[') && !line.startsWith(']'))
      .filter((line) => line.length > 10);
  } catch (error) {
    console.error('Failed to parse memories:', error);
    return [];
  }
}
