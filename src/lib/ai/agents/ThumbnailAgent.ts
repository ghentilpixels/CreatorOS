import { generateObject } from 'ai';
import { z } from 'zod';
import { getModel } from '../providers';

export interface ThumbnailAgentInput {
  topic: string;
  audience: string;
  style: string;
}

export interface GeneratedThumbnail {
  concept: string;
  headline: string;
  emotion: string;
  composition: string;
  objects: string;
  prompt: string;
  tips: string[];
}

export class ThumbnailAgent {
  async run(input: ThumbnailAgentInput): Promise<GeneratedThumbnail> {
    const model = getModel();

    const { object } = await generateObject({
      model,
      schema: z.object({
        concept: z.string().describe("The core visual idea for the thumbnail"),
        headline: z.string().describe("The text overlay to be used on the thumbnail (3-5 words max)"),
        emotion: z.string().describe("The dominant emotion the thumbnail should convey (e.g., Shock, Curiosity)"),
        composition: z.string().describe("How the elements should be arranged (e.g., Face on right, text on left)"),
        objects: z.string().describe("Key visual elements or props to include"),
        prompt: z.string().describe("A highly detailed prompt for an AI image generator (like Midjourney or DALL-E) to create this thumbnail background/concept"),
        tips: z.array(z.string()).describe("3-4 actionable tips to improve CTR for this specific thumbnail idea"),
      }),
      prompt: `You are an expert YouTube Thumbnail Designer and Strategist.
Generate a high-converting thumbnail concept based on the following:

Topic: ${input.topic}
Target Audience: ${input.audience}
Style: ${input.style}

The thumbnail needs to be extremely clickable, utilizing psychology to maximize Click-Through Rate (CTR).
The text (headline) should be punchy and different from the video title.
The AI image prompt should be highly descriptive, specifying lighting, camera angle, and mood.`
    });

    return object;
  }
}
