import { GoogleGenAI } from '@google/genai';
import type { AIProviderClient, ChatMessage, ChatOptions, ChatResponse } from '../types';

/**
 * Gemini Provider Implementation
 * Handles Google Gemini API interactions
 */

// Lazy-initialized client
let client: GoogleGenAI | null = null;

const DEFAULT_MODEL = 'gemini-2.0-flash';
const DEFAULT_MAX_TOKENS = 2048;

function getClient(): GoogleGenAI {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

export const geminiProvider: AIProviderClient = {
  provider: 'gemini',

  isConfigured(): boolean {
    return !!process.env.GEMINI_API_KEY;
  },

  async chat(
    messages: ChatMessage[],
    options: ChatOptions = {}
  ): Promise<ChatResponse> {
    const genai = getClient();

    // Separate system message from conversation
    const systemMessage = options.systemPrompt ||
      messages.find((m) => m.role === 'system')?.content;
    const conversationMessages = messages.filter((m) => m.role !== 'system');

    // Convert to Gemini format (uses 'model' instead of 'assistant')
    const contents = conversationMessages.map((m) => ({
      role: m.role === 'assistant' ? 'model' as const : 'user' as const,
      parts: [{ text: m.content }],
    }));

    const response = await genai.models.generateContent({
      model: options.model || DEFAULT_MODEL,
      contents,
      config: {
        ...(systemMessage && { systemInstruction: systemMessage }),
        maxOutputTokens: options.maxTokens || DEFAULT_MAX_TOKENS,
      },
    });

    return {
      content: response.text || '',
      model: options.model || DEFAULT_MODEL,
      // Gemini doesn't return token usage in same format
    };
  },
};
