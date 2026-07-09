"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export interface AppUser {
  id: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
}

/**
 * Resolve the current user from Supabase auth.
 * Falls back to a mock user in development so pages remain previewable.
 */
export async function getCurrentUser(): Promise<AppUser | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (user && !error) {
      // Sync / upsert local user record
      const dbUser = await prisma.user.upsert({
        where: { id: user.id },
        create: {
          id: user.id,
          email: user.email ?? "unknown@example.com",
          name: user.user_metadata?.name ?? user.email?.split("@")[0],
          avatarUrl: user.user_metadata?.avatar_url,
        },
        update: {
          name: user.user_metadata?.name ?? undefined,
          avatarUrl: user.user_metadata?.avatar_url ?? undefined,
        },
      });

      return {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        avatarUrl: dbUser.avatarUrl,
      };
    }
  } catch (err) {
    console.warn("[auth/session] Supabase session check failed:", err);
  }

  // Development / preview fallback
  if (process.env.NODE_ENV !== "production") {
    return {
      id: "mock-user-id",
      email: "creator@example.com",
      name: "Creator",
    };
  }

  return null;
}

/**
 * Require an authenticated user. Throws a clear error if not authenticated.
 */
export async function requireUser(): Promise<AppUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}
