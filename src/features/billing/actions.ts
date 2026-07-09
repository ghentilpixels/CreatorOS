"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/session";
import { getActiveWorkspace } from "@/lib/workspace/session";
import { handleActionError } from "@/lib/errors";
import { PLANS, type PlanId } from "@/lib/subscription/plans";
import { getUsage } from "@/lib/usage/limits";

export async function getBillingOverview() {
  try {
    const user = await requireUser();
    const workspace = await getActiveWorkspace(user);
    if (!workspace) throw new Error("NO_WORKSPACE");

    const subscription = await prisma.subscription.findUnique({
      where: { workspaceId: workspace.id },
    });

    const usage = await getUsage(workspace.id, workspace.plan);

    return {
      success: true as const,
      plan: workspace.plan,
      subscription: subscription
        ? {
            status: subscription.status,
            currentPeriodEnd: subscription.currentPeriodEnd,
            cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
          }
        : null,
      usage,
      plans: PLANS,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function updatePlan(planId: PlanId) {
  try {
    const user = await requireUser();
    const workspace = await getActiveWorkspace(user);
    if (!workspace) throw new Error("NO_WORKSPACE");
    if (workspace.role !== "owner") throw new Error("FORBIDDEN");

    await prisma.$transaction([
      prisma.workspace.update({
        where: { id: workspace.id },
        data: { plan: planId },
      }),
      prisma.subscription.update({
        where: { workspaceId: workspace.id },
        data: { plan: planId, status: "active" },
      }),
    ]);

    revalidatePath("/settings/billing");
    return { success: true as const };
  } catch (error) {
    return handleActionError(error);
  }
}
