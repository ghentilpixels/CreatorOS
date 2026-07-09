"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/session";
import { getActiveWorkspace } from "@/lib/workspace/session";
import { handleActionError } from "@/lib/errors";
import { checkLimit, incrementUsage } from "@/lib/usage/limits";
import {
  PLATFORM_PUBLISHERS,
  PLATFORM_META,
  type PublishResult,
} from "./services/platforms";
import type { IntegrationPlatform, PublishingDraft } from "@/lib/types";

function ensureCanEdit(role: string) {
  if (role === "viewer") {
    throw new Error("FORBIDDEN");
  }
}

export async function getIntegrations() {
  try {
    const user = await requireUser();
    const workspace = await getActiveWorkspace(user);
    if (!workspace) throw new Error("NO_WORKSPACE");

    const integrations = await prisma.integration.findMany({
      where: { workspaceId: workspace.id },
    });

    const allPlatforms = Object.keys(PLATFORM_META) as IntegrationPlatform[];

    return {
      success: true as const,
      integrations: allPlatforms.map((platform) => {
        const existing = integrations.find((i) => i.platform === platform);
        return {
          platform,
          status: (existing?.status ?? "disconnected") as
            | "connected"
            | "disconnected"
            | "expired"
            | "error",
          accountName: existing?.accountName ?? null,
        };
      }),
    };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function connectPlatform(platform: IntegrationPlatform) {
  try {
    const user = await requireUser();
    const workspace = await getActiveWorkspace(user);
    if (!workspace) throw new Error("NO_WORKSPACE");
    ensureCanEdit(workspace.role);

    const publisher = PLATFORM_PUBLISHERS[platform];
    const connectResult = await publisher.connect();

    await prisma.integration.upsert({
      where: { workspaceId_platform: { workspaceId: workspace.id, platform } },
      create: {
        workspaceId: workspace.id,
        platform,
        status: connectResult.success ? "connected" : "error",
        accountName: connectResult.success ? "Connected Account" : null,
        metadata: { authUrl: connectResult.authUrl },
      },
      update: {
        status: connectResult.success ? "connected" : "error",
        accountName: connectResult.success ? "Connected Account" : null,
        metadata: { authUrl: connectResult.authUrl },
      },
    });

    revalidatePath("/publish");
    return { success: true as const, authUrl: connectResult.authUrl };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function disconnectPlatform(platform: IntegrationPlatform) {
  try {
    const user = await requireUser();
    const workspace = await getActiveWorkspace(user);
    if (!workspace) throw new Error("NO_WORKSPACE");
    ensureCanEdit(workspace.role);

    await prisma.integration.updateMany({
      where: { workspaceId: workspace.id, platform },
      data: { status: "disconnected", accountName: null, accessToken: null },
    });

    revalidatePath("/publish");
    return { success: true as const };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function createPost(
  draft: PublishingDraft,
): Promise<{ success: true; postId: string } | { success: false; error: string; code?: string }> {
  try {
    const user = await requireUser();
    const workspace = await getActiveWorkspace(user);
    if (!workspace) throw new Error("NO_WORKSPACE");
    ensureCanEdit(workspace.role);

    await checkLimit(workspace.id, "publishedPosts", 1, workspace.plan);

    const selectedPlatforms = Object.entries(draft.platforms)
      .filter(([, enabled]) => enabled)
      .map(([key]) => key as IntegrationPlatform);

    if (selectedPlatforms.length === 0) {
      throw new Error("NO_PLATFORMS_SELECTED");
    }

    const platformsRecord = Object.fromEntries(
      selectedPlatforms.map((p) => [p, true]),
    );

    const post = await prisma.publishingPost.create({
      data: {
        workspaceId: workspace.id,
        title: draft.title,
        description: draft.description,
        mediaUrl: draft.mediaUrl,
        platforms: platformsRecord,
        status: draft.scheduledAt ? "scheduled" : "draft",
        scheduledAt: draft.scheduledAt,
      },
    });

    revalidatePath("/publish");
    return { success: true, postId: post.id };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function getPosts(status?: string) {
  try {
    const user = await requireUser();
    const workspace = await getActiveWorkspace(user);
    if (!workspace) throw new Error("NO_WORKSPACE");

    const posts = await prisma.publishingPost.findMany({
      where: {
        workspaceId: workspace.id,
        ...(status ? { status } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return { success: true as const, posts };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function publishPost(
  postId: string,
): Promise<{ success: true; results: Record<string, PublishResult> } | { success: false; error: string; code?: string }> {
  try {
    const user = await requireUser();
    const workspace = await getActiveWorkspace(user);
    if (!workspace) throw new Error("NO_WORKSPACE");
    ensureCanEdit(workspace.role);

    const post = await prisma.publishingPost.findFirst({
      where: { id: postId, workspaceId: workspace.id },
    });

    if (!post) throw new Error("POST_NOT_FOUND");

    const platforms = Object.keys(post.platforms ?? {}) as IntegrationPlatform[];
    const results: Record<string, PublishResult> = {};
    let hasError = false;

    await checkLimit(workspace.id, "publishedPosts", 1, workspace.plan);

    await prisma.publishingPost.update({
      where: { id: postId },
      data: { status: "publishing" },
    });

    for (const platform of platforms) {
      const integration = await prisma.integration.findUnique({
        where: { workspaceId_platform: { workspaceId: workspace.id, platform } },
      });

      if (!integration || integration.status !== "connected") {
        results[platform] = { success: false, error: "Platform not connected" };
        hasError = true;
        continue;
      }

      const publisher = PLATFORM_PUBLISHERS[platform];
      const result = await publisher.publish({
        title: post.title,
        description: post.description ?? undefined,
        mediaUrl: post.mediaUrl ?? undefined,
      });

      results[platform] = result;
      if (!result.success) hasError = true;
    }

    const finalStatus = hasError ? "failed" : "published";

    await prisma.publishingPost.update({
      where: { id: postId },
      data: {
        status: finalStatus,
        publishedAt: finalStatus === "published" ? new Date() : null,
        results: results as any,
        error: hasError
          ? Object.values(results)
              .map((r) => r.error)
              .filter(Boolean)
              .join("; ")
          : null,
      },
    });

    if (!hasError) {
      await incrementUsage(workspace.id, "publishedPosts");
    }

    revalidatePath("/publish");
    if (hasError) {
      return {
        success: false,
        error: Object.values(results)
          .map((r) => r.error)
          .filter(Boolean)
          .join("; "),
      };
    }
    return { success: true, results };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function schedulePost(postId: string, scheduledAt: Date) {
  try {
    const user = await requireUser();
    const workspace = await getActiveWorkspace(user);
    if (!workspace) throw new Error("NO_WORKSPACE");
    ensureCanEdit(workspace.role);

    await prisma.publishingPost.update({
      where: { id: postId, workspaceId: workspace.id },
      data: { status: "scheduled", scheduledAt },
    });

    revalidatePath("/publish");
    return { success: true as const };
  } catch (error) {
    return handleActionError(error);
  }
}
