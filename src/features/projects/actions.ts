"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/session";
import { getActiveWorkspace } from "@/lib/workspace/session";
import { handleActionError } from "@/lib/errors";

export async function getProjects() {
  try {
    const user = await requireUser();
    const workspace = await getActiveWorkspace(user);
    if (!workspace) throw new Error("NO_WORKSPACE");

    const projects = await prisma.project.findMany({
      where: {
        workspaceId: workspace.id,
      },
      include: {
        _count: {
          select: { videos: true }
        }
      },
      orderBy: { updatedAt: "desc" },
    });

    return { success: true as const, projects };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function createProject(name: string, platform: string, category: string) {
  try {
    const user = await requireUser();
    const workspace = await getActiveWorkspace(user);
    if (!workspace) throw new Error("NO_WORKSPACE");

    const project = await prisma.project.create({
      data: {
        title: name,
        platform,
        category,
        userId: user.id,
        workspaceId: workspace.id,
        status: "active",
      },
    });

    revalidatePath("/projects");
    revalidatePath("/");
    return { success: true as const, projectId: project.id };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function updateVideoStatus(videoId: string, newStatus: string) {
  try {
    console.log("Updating Video Status (Server Action):", { videoId, newStatus });
    
    // Example Prisma implementation:
    // await prisma.video.update({
    //   where: { id: videoId },
    //   data: { status: newStatus }
    // });

    revalidatePath("/projects/[id]");
    return { success: true };
  } catch (error) {
    console.error("Failed to update status", error);
    return { success: false, error: "Failed to update status" };
  }
}

export async function generateIdea(topic: string) {
  try {
    console.log("Generating AI Idea (Server Action):", topic);
    // Integrate with OpenAI or similar here
    return { success: true, ideas: ["10 secrets of Next.js", "Mastering React 19"] };
  } catch (error) {
    return { success: false, error: "Failed to generate ideas" };
  }
}
