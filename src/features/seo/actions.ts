"use server";

import { revalidatePath } from "next/cache";
import { SeoAgent, SeoAgentInput } from "@/lib/ai/agents/SeoAgent";
import { prisma } from "@/lib/prisma";

export async function generateSeoAssetAI(input: SeoAgentInput) {
  try {
    const agent = new SeoAgent();
    const seoData = await agent.run(input);
    return { success: true, data: seoData };
  } catch (error) {
    console.error("Failed to generate SEO metadata:", error);
    return { success: false, error: "Failed to generate SEO metadata" };
  }
}

export async function saveSeoAsset(data: {
  title: string;
  description: string;
  tags?: string[];
  keywords?: string[];
  hashtags?: string[];
  pinnedComment?: string;
  communityPost?: string;
  projectId?: string;
}) {
  try {
    const seoAsset = await prisma.sEOAsset.create({
      data: {
        title: data.title,
        description: data.description,
        tags: data.tags ? JSON.parse(JSON.stringify(data.tags)) : undefined,
        keywords: data.keywords ? JSON.parse(JSON.stringify(data.keywords)) : undefined,
        hashtags: data.hashtags ? JSON.parse(JSON.stringify(data.hashtags)) : undefined,
        pinnedComment: data.pinnedComment,
        communityPost: data.communityPost,
        projectId: data.projectId || null,
      }
    });

    revalidatePath("/seo-studio");
    return { success: true, data: seoAsset };
  } catch (error) {
    console.error("Failed to save SEO Asset:", error);
    return { success: false, error: "Failed to save SEO metadata" };
  }
}

export async function getSeoAssets() {
  try {
    const seoAssets = await prisma.sEOAsset.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: seoAssets };
  } catch (error) {
    console.error("Failed to fetch SEO Assets:", error);
    return { success: false, error: "Failed to fetch SEO Assets" };
  }
}
