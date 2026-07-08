import { generateObject } from 'ai';
import { z } from 'zod';
import { getModel } from '../providers';
import { AgentInput, ResearchResult, BaseAgent } from '../types';

export class ResearchAgent implements BaseAgent<AgentInput, ResearchResult> {
  async run(input: AgentInput): Promise<ResearchResult> {
    const model = getModel();

    const { object } = await generateObject({
      model,
      schema: z.object({
        topicSummary: z.string().describe('A comprehensive summary of the topic'),
        marketOpportunity: z.string().describe('Analysis of the market opportunity and potential'),
        trendingQuestions: z.array(z.string()).describe('List of questions people are asking about this topic'),
        audiencePainPoints: z.array(z.string()).describe('Key pain points and struggles of the target audience'),
        competitorAnalysis: z.string().describe('Overview of what competitors are doing right and wrong'),
        keywordSuggestions: z.array(z.string()).describe('High volume or high intent keywords'),
        videoIdeas: z.array(z.string()).describe('Actionable video concepts based on the research'),
        contentAngles: z.array(z.string()).describe('Unique angles and perspectives to take'),
        recommendedTitles: z.array(z.string()).describe('Clickable, high-converting title suggestions'),
      }),
      prompt: `You are an expert Research Agent for CreatorOS.
Generate a comprehensive research report for a content creator.

Focus Area:
Topic: ${input.topic}
Target Audience: ${input.audience}
Target Platform: ${input.platform}
Content Type: ${input.contentType}

Provide a detailed structured output tailored to these specific inputs.`
    });

    return object;
  }
}
