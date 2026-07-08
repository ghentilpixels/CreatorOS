"use server";

import { revalidatePath } from "next/cache";
import { ResearchAgent } from "@/lib/ai/agents/ResearchAgent";
import { AgentInput } from "@/lib/ai/types";

export async function generateResearch(input: AgentInput) {
  try {
    const agent = new ResearchAgent();
    
    // Call the AI Provider (Requires valid API keys to be configured)
    const result = await agent.run(input);

    console.log("Generated Research for topic:", input.topic);

    // Example Prisma implementation to save the report:
    // await prisma.research.create({
    //   data: { 
    //     topic: input.topic,
    //     summary: result.topicSummary,
    //     keywords: result.keywordSuggestions,
    //     ideas: result.videoIdeas,
    //     userId: "mock-user-id" 
    //   }
    // });

    revalidatePath("/research-studio");
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to generate research", error);
    return { success: false, error: "Failed to generate research" };
  }
}
