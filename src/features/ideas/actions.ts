"use server";

import { revalidatePath } from "next/cache";
import { IdeaAgent } from "@/lib/ai/agents/IdeaAgent";
import { prisma } from "@/lib/prisma";

export async function generateIdeasAI(topic: string, platform?: string) {
  try {
    const agent = new IdeaAgent();
    const ideas = await agent.run({ topic, platform });
    
    console.log(`Generated ${ideas.length} ideas for topic:`, topic);

    return { success: true, data: ideas };
  } catch (error) {
    console.error("Failed to generate ideas:", error);
    return { success: false, error: "Failed to generate ideas" };
  }
}

export async function createIdea(data: { title: string; description?: string; platform?: string }) {
  try {
    console.log("Creating Idea (Server Action):", data);
    
    await prisma.idea.create({ 
      data: { 
        ...data, 
        status: "new" 
      } 
    });

    revalidatePath("/ideas");
    return { success: true };
  } catch (error) {
    console.error("Failed to create idea", error);
    return { success: false, error: "Failed to create idea" };
  }
}

export async function getIdeas() {
  try {
    const ideas = await prisma.idea.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: ideas };
  } catch (error) {
    console.error("Failed to fetch ideas", error);
    return { success: false, error: "Failed to fetch ideas" };
  }
}
