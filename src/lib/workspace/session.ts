import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { requireUser, type AppUser } from "@/lib/auth/session";

export const ACTIVE_WORKSPACE_COOKIE = "active-workspace-id";

export interface ActiveWorkspace {
  id: string;
  name: string;
  slug: string;
  plan: string;
  role: string;
  ownerId: string;
}

/**
 * Get the currently active workspace for the request.
 * Falls back to the user's first workspace or a default workspace.
 */
export async function getActiveWorkspace(user?: AppUser): Promise<ActiveWorkspace | null> {
  const currentUser = user ?? (await requireUser());

  const cookieStore = await cookies();
  const activeId = cookieStore.get(ACTIVE_WORKSPACE_COOKIE)?.value;

  if (activeId) {
    const workspace = await prisma.workspace.findUnique({
      where: { id: activeId },
      include: { members: { where: { userId: currentUser.id } } },
    });
    if (workspace && workspace.members.length > 0) {
      return {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
        plan: workspace.plan,
        role: workspace.members[0].role,
        ownerId: workspace.ownerId,
      };
    }
  }

  // Fallback: first owned / member workspace
  const membership = await prisma.workspaceMember.findFirst({
    where: { userId: currentUser.id, status: "active" },
    orderBy: { createdAt: "asc" },
    include: { workspace: true },
  });

  if (membership) {
    return {
      id: membership.workspace.id,
      name: membership.workspace.name,
      slug: membership.workspace.slug,
      plan: membership.workspace.plan,
      role: membership.role,
      ownerId: membership.workspace.ownerId,
    };
  }

  // Last resort: create a default workspace for this user
  return ensureDefaultWorkspace(currentUser);
}

/**
 * Set the active workspace cookie.
 */
export async function setActiveWorkspace(workspaceId: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_WORKSPACE_COOKIE, workspaceId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

/**
 * Ensure a user has at least one workspace.
 */
export async function ensureDefaultWorkspace(user: AppUser): Promise<ActiveWorkspace> {
  const existing = await prisma.workspace.findFirst({
    where: { ownerId: user.id },
    include: { members: { where: { userId: user.id } } },
  });

  if (existing) {
    return {
      id: existing.id,
      name: existing.name,
      slug: existing.slug,
      plan: existing.plan,
      role: existing.members[0]?.role ?? "owner",
      ownerId: existing.ownerId,
    };
  }

  const workspace = await prisma.$transaction(async (tx) => {
    const ws = await tx.workspace.create({
      data: {
        name: `${user.name ?? user.email}'s Workspace`,
        slug: `workspace-${user.id.slice(0, 8)}`,
        ownerId: user.id,
        plan: "free",
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
        plan: "free",
        status: "active",
        seats: 1,
      },
    });

    return ws;
  });

  await setActiveWorkspace(workspace.id);

  return {
    id: workspace.id,
    name: workspace.name,
    slug: workspace.slug,
    plan: workspace.plan,
    role: "owner",
    ownerId: workspace.ownerId,
  };
}
