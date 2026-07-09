"use server";

import { revalidatePath } from "next/cache";
import { ThumbnailAgent, ThumbnailAgentInput } from "@/lib/ai/agents/ThumbnailAgent";
import { prisma } from "@/lib/prisma";

export async function generateThumbnailAI(input: ThumbnailAgentInput) {
  try {
    const agent = new ThumbnailAgent();
    const thumbnailData = await agent.run(input);
    return { success: true, data: thumbnailData };
  } catch (error) {
    console.error("Failed to generate thumbnail:", error);
    return { success: false, error: "Failed to generate thumbnail concept" };
  }
}

export async function saveThumbnail(data: {
  concept: string;
  headline: string;
  emotion?: string;
  composition?: string;
  objects?: string;
  prompt: string;
  tips?: string[];
  projectId?: string;
}) {
  try {
    const thumbnail = await prisma.thumbnail.create({
      data: {
        concept: data.concept,
        headline: data.headline,
        emotion: data.emotion,
        composition: data.composition,
        objects: data.objects,
        prompt: data.prompt,
        tips: data.tips ? JSON.parse(JSON.stringify(data.tips)) : undefined,
        projectId: data.projectId || null,
      }
    });

    revalidatePath("/thumbnail-studio");
    return { success: true, data: thumbnail };
  } catch (error) {
    console.error("Failed to save thumbnail:", error);
    return { success: false, error: "Failed to save thumbnail" };
  }
}

export async function getThumbnails() {
  try {
    const thumbnails = await prisma.thumbnail.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: thumbnails };
  } catch (error) {
    console.error("Failed to fetch thumbnails:", error);
    return { success: false, error: "Failed to fetch thumbnails" };
  }
}
