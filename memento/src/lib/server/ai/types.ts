/**
 * AI Provider Types
 * Unified interfaces for multi-provider AI support
 */

export type AIProvider = 'claude' | 'gemini';

/**
 * Message format for conversations
 */
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Chat request options
 */
export interface ChatOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

/**
 * Chat response
 */
export interface ChatResponse {
  content: string;
  model: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

/**
 * Provider interface for chat completions
 */
export interface AIProviderClient {
  readonly provider: AIProvider;

  /**
   * Generate a chat completion
   */
  chat(
    messages: ChatMessage[],
    options?: ChatOptions
  ): Promise<ChatResponse>;

  /**
   * Check if the provider is configured and ready
   */
  isConfigured(): boolean;
}

/**
 * Memory extraction request
 */
export interface MemoryExtractionRequest {
  content: string;
  type: 'conversation' | 'document';
}

/**
 * Memory extraction response
 */
export interface MemoryExtractionResponse {
  memories: string[];
}
