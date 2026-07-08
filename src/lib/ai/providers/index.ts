import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';

export function getModel(provider: 'openai' | 'anthropic' | 'google' = 'google') {
  switch (provider) {
    case 'openai':
      return openai('gpt-4o');
    case 'anthropic':
      return anthropic('claude-3-5-sonnet-20240620');
    case 'google':
      return google('gemini-1.5-pro');
    default:
      return google('gemini-1.5-pro');
  }
}
