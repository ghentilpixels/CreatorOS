"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/session";
import { getActiveWorkspace, setActiveWorkspace, ensureDefaultWorkspace } from "@/lib/workspace/session";
import { handleActionError } from "@/lib/errors";
import { checkLimit } from "@/lib/usage/limits";
import type { WorkspaceMemberRow } from "@/lib/types";

export async function getWorkspaces() {
  try {
    const user = await requireUser();
    const memberships = await prisma.workspaceMember.findMany({
      where: { userId: user.id, status: "active" },
      include: { workspace: { include: { subscription: true } } },
      orderBy: { createdAt: "asc" },
    });

    return {
      success: true as const,
      workspaces: memberships.map((m) => ({
        id: m.workspace.id,
        name: m.workspace.name,
        slug: m.workspace.slug,
        plan: m.workspace.plan,
        role: m.role,
        status: m.workspace.subscription?.status ?? "active",
      })),
    };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function createWorkspace(name: string, plan = "free") {
  try {
    const user = await requireUser();

    // Soft limit on owned workspaces
    const owned = await prisma.workspace.count({ where: { ownerId: user.id } });
    if (owned >= 5) {
      throw new Error("WORKSPACE_LIMIT_REACHED");
    }

    const slugBase = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const slug = `${slugBase}-${Date.now().toString(36)}`;

    const workspace = await prisma.$transaction(async (tx) => {
      const ws = await tx.workspace.create({
        data: {
          name,
          slug,
          ownerId: user.id,
          plan,
        },
      });

      await tx.workspaceMember.create({
        data: {
          workspaceId: ws.id,
          userId: user.id,
          role: "owner",
          status: "active",
        },
      });

      await tx.subscription.create({
        data: {
          workspaceId: ws.id,
          plan,
          status: "active",
          seats: 1,
        },
      });

      return ws;
    });

    await setActiveWorkspace(workspace.id);
    revalidatePath("/");

    return { success: true as const, workspaceId: workspace.id };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function switchWorkspace(workspaceId: string) {
  try {
    const user = await requireUser();
    const membership = await prisma.workspaceMember.findFirst({
      where: { workspaceId, userId: user.id, status: "active" },
    });

    if (!membership) throw new Error("FORBIDDEN");

    await setActiveWorkspace(workspaceId);
    revalidatePath("/");

    return { success: true as const };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function getCurrentWorkspace() {
  try {
    const user = await requireUser();
    await ensureDefaultWorkspace(user);
    const workspace = await getActiveWorkspace(user);
    if (!workspace) throw new Error("NO_WORKSPACE");

    const members = await prisma.workspaceMember.findMany({
      where: { workspaceId: workspace.id },
      include: { user: true },
      orderBy: { createdAt: "asc" },
    });

    const rows: WorkspaceMemberRow[] = members.map((m) => ({
      id: m.id,
      email: m.user?.email ?? m.invitedEmail ?? undefined,
      name: m.user?.name ?? undefined,
      role: m.role,
      status: m.status,
      avatarUrl: m.user?.avatarUrl ?? undefined,
    }));

    return {
      success: true as const,
      workspace,
      members: rows,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function inviteMember(email: string, role: string) {
  try {
    const user = await requireUser();
    const workspace = await getActiveWorkspace(user);
    if (!workspace) throw new Error("NO_WORKSPACE");
    if (workspace.role !== "owner" && workspace.role !== "admin") {
      throw new Error("FORBIDDEN");
    }

    const planSeats = workspace.plan === "team" ? 10 : 1;
    const currentSeats = await prisma.workspaceMember.count({
      where: { workspaceId: workspace.id, status: "active" },
    });

    if (currentSeats >= planSeats) {
      throw new Error("SEAT_LIMIT_REACHED");
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    await prisma.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: existingUser?.id,
        invitedEmail: email,
        role,
        status: existingUser ? "active" : "invited",
      },
    });

    revalidatePath("/settings/workspace");
    return { success: true as const };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function updateMemberRole(memberId: string, role: string) {
  try {
    const user = await requireUser();
    const workspace = await getActiveWorkspace(user);
    if (!workspace) throw new Error("NO_WORKSPACE");
    if (workspace.role !== "owner" && workspace.role !== "admin") {
      throw new Error("FORBIDDEN");
    }

    await prisma.workspaceMember.updateMany({
      where: { id: memberId, workspaceId: workspace.id },
      data: { role },
    });

    revalidatePath("/settings/workspace");
    return { success: true as const };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function removeMember(memberId: string) {
  try {
    const user = await requireUser();
    const workspace = await getActiveWorkspace(user);
    if (!workspace) throw new Error("NO_WORKSPACE");
    if (workspace.role !== "owner" && workspace.role !== "admin") {
      throw new Error("FORBIDDEN");
    }

    await prisma.workspaceMember.deleteMany({
      where: { id: memberId, workspaceId: workspace.id },
    });

    revalidatePath("/settings/workspace");
    return { success: true as const };
  } catch (error) {
    return handleActionError(error);
  }
}
