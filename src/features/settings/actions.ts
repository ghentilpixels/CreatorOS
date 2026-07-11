"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/session";
import { handleActionError } from "@/lib/errors";

export async function getUserProfile() {
  try {
    const user = await requireUser();
    return { success: true as const, user };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function updateProfile(data: { name: string }) {
  try {
    const user = await requireUser();
    
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { name: data.name },
    });
    
    revalidatePath("/settings");
    return { success: true as const, user: updated };
  } catch (error) {
    return handleActionError(error);
  }
}
