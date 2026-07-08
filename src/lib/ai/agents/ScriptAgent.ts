import { generateObject } from 'ai';
import { z } from 'zod';
import { getModel } from '../providers';

export interface ScriptAgentInput {
  topic: string;
  videoLength: string;
  audience: string;
  tone: string;
  style: string;
  platform: string;
}

export interface GeneratedScript {
  seoTitle: string;
  hook: string;
  introduction: string;
  mainSections: { title: string; content: string }[];
  examples: string[];
  conclusion: string;
  callToAction: string;
  bRollSuggestions: string[];
  editingNotes: string;
}

export class ScriptAgent {
  async run(input: ScriptAgentInput): Promise<GeneratedScript> {
    const model = getModel();

    const { object } = await generateObject({
      model,
      schema: z.object({
        seoTitle: z.string().describe("A highly searchable, SEO-optimized title"),
        hook: z.string().describe("A compelling 10-15 second opening hook to grab attention immediately"),
        introduction: z.string().describe("The setup and context setting for the video"),
        mainSections: z.array(z.object({
          title: z.string(),
          content: z.string().describe("The main script content for this section"),
        })).describe("The core body of the video, broken down into logical sections"),
        examples: z.array(z.string()).describe("Specific examples or case studies to illustrate the points"),
        conclusion: z.string().describe("A strong wrap-up summarizing the main value proposition"),
        callToAction: z.string().describe("What the viewer should do next (e.g., subscribe, click a link)"),
        bRollSuggestions: z.array(z.string()).describe("Visual ideas for B-roll footage to overlay"),
        editingNotes: z.string().describe("Pacing, sound effects, text overlay suggestions for the editor"),
      }),
      prompt: `You are an expert Scriptwriter for CreatorOS, specializing in creating high-performing video scripts.
Generate a complete, engaging script based on the following requirements:

Topic: ${input.topic}
Video Length: ${input.videoLength}
Target Audience: ${input.audience}
Tone: ${input.tone}
Style: ${input.style}
Platform: ${input.platform}

Ensure the script perfectly matches the requested tone and style (e.g., Educational, Documentary, Tutorial, Review, Storytelling).
The structure must be extremely engaging, focused on high retention (watch time), and optimized for the platform's algorithm.`
    });

    return object;
  }
}
