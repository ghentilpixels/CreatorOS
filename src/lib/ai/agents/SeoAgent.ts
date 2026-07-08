import { generateObject } from 'ai';
import { z } from 'zod';
import { getModel } from '../providers';

export interface SeoAgentInput {
  topic: string;
  context?: string;
  platform?: string;
}

export interface GeneratedSeo {
  title: string;
  description: string;
  tags: string[];
  keywords: string[];
  hashtags: string[];
  pinnedComment: string;
  communityPost: string;
}

export class SeoAgent {
  async run(input: SeoAgentInput): Promise<GeneratedSeo> {
    const model = getModel();

    const { object } = await generateObject({
      model,
      schema: z.object({
        title: z.string().describe("A highly searchable, optimized YouTube title under 60 characters"),
        description: z.string().describe("A detailed YouTube video description with SEO keywords natively integrated. Includes hook, summary, and links placeholders."),
        tags: z.array(z.string()).describe("15-20 highly relevant YouTube tags, sorted by importance"),
        keywords: z.array(z.string()).describe("5-10 core SEO keywords to target across all metadata"),
        hashtags: z.array(z.string()).describe("3-5 highly relevant hashtags to include at the bottom of the description"),
        pinnedComment: z.string().describe("An engaging pinned comment to spark discussion and drive engagement (e.g., asking a question)"),
        communityPost: z.string().describe("A YouTube community tab post to promote the video to subscribers"),
      }),
      prompt: `You are an expert YouTube SEO Strategist for CreatorOS.
Generate comprehensive, high-performing metadata for a video based on the following input:

Topic: ${input.topic}
Context/Script Ideas: ${input.context || 'None provided'}
Platform: ${input.platform || 'YouTube'}

Requirements:
- Title: Provide a highly engaging, click-optimized (high CTR) title that incorporates target keywords naturally.
- Description: Write a compelling 2-3 paragraph description weaving in keywords. Include sections for: [Timestamps], [Links mentioned], and [Social Links].
- Tags, Keywords & Hashtags: Provide specific, relevant lists for YouTube SEO.
- Pinned Comment & Community Post: Write engaging short-form copy to drive interaction.`
    });

    return object;
  }
}
