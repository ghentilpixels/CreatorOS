"use server";

import { revalidatePath } from "next/cache";

export async function updateProfile(data: { name: string }) {
  // In a real app, this would update the database using Prisma
  // await prisma.user.update({ where: { id: userId }, data: { name: data.name } })
  
  console.log("Updating profile with:", data);
  
  // Revalidate settings path to show updated data
  revalidatePath("/settings");
  
  return { success: true };
}
