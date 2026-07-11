import { openai, createOpenAI } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';

// OpenRouter provider (supports 300+ models, great fallback)
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  headers: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL ?? 'https://creatoros.app',
    'X-Title': 'CreatorOS',
  },
});

export type ProviderName = 'openai' | 'google' | 'openrouter';

/**
 * Returns the best available AI model based on configured API keys.
 * Priority: OpenAI → Google → OpenRouter
 */
export function getModel(provider?: ProviderName) {
  // If a specific provider is requested, use it
  if (provider === 'openai' && process.env.OPENAI_API_KEY) {
    return openai('gpt-4o');
  }
  if (provider === 'google' && process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return google('gemini-1.5-pro');
  }
  if (provider === 'openrouter' && process.env.OPENROUTER_API_KEY) {
    const model = process.env.OPENROUTER_MODEL ?? 'openai/gpt-4o';
    return openrouter(model);
  }

  // Auto-select: pick the first available key
  if (process.env.OPENAI_API_KEY) {
    return openai('gpt-4o');
  }
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return google('gemini-1.5-pro');
  }
  if (process.env.OPENROUTER_API_KEY) {
    const model = process.env.OPENROUTER_MODEL ?? 'openai/gpt-4o';
    return openrouter(model);
  }

  throw new Error(
    'No AI API key configured. Set OPENAI_API_KEY, GOOGLE_GENERATIVE_AI_API_KEY, or OPENROUTER_API_KEY in your .env file.'
  );
}

/**
 * Returns a fast/cheap model for simple tasks (lists, tags, etc.)
 */
export function getFastModel() {
  if (process.env.OPENAI_API_KEY) {
    return openai('gpt-4o-mini');
  }
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return google('gemini-1.5-flash');
  }
  if (process.env.OPENROUTER_API_KEY) {
    return openrouter('openai/gpt-4o-mini');
  }
  return getModel();
}
