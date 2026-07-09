"use server";

import { prisma } from "@/lib/prisma";
import { getPlan, type PlanId } from "@/lib/subscription/plans";

export type UsageKey =
  | "projects"
  | "videos"
  | "aiGenerations"
  | "publishedPosts"
  | "teamSeats"
  | "storageMb";

export interface UsageSnapshot {
  used: number;
  limit: number;
  percent: number;
  remaining: number;
  unlimited: boolean;
}

function periodBounds(now = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return { start, end };
}

export async function getOrCreateQuota(workspaceId: string, now = new Date()) {
  const { start, end } = periodBounds(now);

  let quota = await prisma.usageQuota.findUnique({
    where: { workspaceId_periodStart: { workspaceId, periodStart: start } },
  });

  if (!quota) {
    quota = await prisma.usageQuota.create({
      data: {
        workspaceId,
        periodStart: start,
        periodEnd: end,
      },
    });
  }

  return quota;
}

export async function getUsage(workspaceId: string, planId: string = "free") {
  const plan = getPlan(planId);
  const quota = await getOrCreateQuota(workspaceId);

  const snapshot = (key: UsageKey): UsageSnapshot => {
    const used = quota[key] ?? 0;
    const limit = plan.limits[key];
    const unlimited = !Number.isFinite(limit);
    return {
      used,
      limit,
      percent: unlimited ? 0 : Math.min(100, Math.round((used / limit) * 100)),
      remaining: unlimited ? Number.POSITIVE_INFINITY : Math.max(0, limit - used),
      unlimited,
    };
  };

  return {
    aiGenerations: snapshot("aiGenerations"),
    projects: snapshot("projects"),
    videos: snapshot("videos"),
    publishedPosts: snapshot("publishedPosts"),
    teamSeats: snapshot("teamSeats"),
    storageMb: snapshot("storageMb"),
  };
}

export async function checkLimit(
  workspaceId: string,
  key: UsageKey,
  amount: number = 1,
  planId: string = "free",
) {
  const usage = await getUsage(workspaceId, planId);
  const snapshot = usage[key];

  if (!snapshot.unlimited && snapshot.used + amount > snapshot.limit) {
    throw new Error(
      `LIMIT_EXCEEDED:${key}:${snapshot.limit}:${snapshot.used}`,
    );
  }
}

export async function incrementUsage(
  workspaceId: string,
  key: UsageKey,
  amount: number = 1,
) {
  const quota = await getOrCreateQuota(workspaceId);
  await prisma.usageQuota.update({
    where: { id: quota.id },
    data: {
      [key]: { increment: amount },
    },
  });
}
