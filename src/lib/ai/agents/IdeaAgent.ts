import { generateObject } from 'ai';
import { z } from 'zod';
import { getModel } from '../providers';

export interface IdeaAgentInput {
  topic: string;
  platform?: string;
  targetAudience?: string;
}

export interface GeneratedIdea {
  title: string;
  description: string;
  platform: string;
}

export class IdeaAgent {
  async run(input: IdeaAgentInput): Promise<GeneratedIdea[]> {
    const model = getModel();

    const { object } = await generateObject({
      model,
      schema: z.object({
        ideas: z.array(z.object({
          title: z.string().describe("Catchy, high-converting title"),
          description: z.string().describe("A 2-3 sentence overview of the idea"),
          platform: z.string().describe("Recommended platform (e.g., YouTube, TikTok, Twitter)"),
        }))
      }),
      prompt: `You are an expert Content Strategy Agent for CreatorOS.
Generate 5-10 highly creative, platform-specific content ideas based on the following input:

Topic: ${input.topic}
${input.platform ? `Target Platform: ${input.platform}` : ''}
${input.targetAudience ? `Target Audience: ${input.targetAudience}` : ''}

Provide a structured list of actionable ideas that will perform well.`
    });

    return object.ideas;
  }
}
