import Anthropic from '@anthropic-ai/sdk';
import type { AIProviderClient, ChatMessage, ChatOptions, ChatResponse } from '../types';

/**
 * Claude Provider Implementation
 * Handles Claude/Anthropic API interactions
 */

// Lazy-initialized client
let client: Anthropic | null = null;

const DEFAULT_MODEL = 'claude-sonnet-4-20250514';
const DEFAULT_MAX_TOKENS = 2048;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

export const claudeProvider: AIProviderClient = {
  provider: 'claude',

  isConfigured(): boolean {
    return !!process.env.ANTHROPIC_API_KEY;
  },

  async chat(
    messages: ChatMessage[],
    options: ChatOptions = {}
  ): Promise<ChatResponse> {
    const anthropic = getClient();

    // Separate system message from conversation
    const systemMessage = options.systemPrompt ||
      messages.find((m) => m.role === 'system')?.content;
    const conversationMessages = messages.filter((m) => m.role !== 'system');

    const response = await anthropic.messages.create({
      model: options.model || DEFAULT_MODEL,
      max_tokens: options.maxTokens || DEFAULT_MAX_TOKENS,
      ...(systemMessage && { system: systemMessage }),
      messages: conversationMessages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    const content = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

    return {
      content,
      model: response.model,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    };
  },
};
