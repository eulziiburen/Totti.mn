"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { scoreboardStats } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";

async function requireAuth() {
  if (!(await isAuthenticated())) throw new Error("Not authenticated");
}

export async function upsertStat(formData: FormData) {
  await requireAuth();
  const idRaw = formData.get("id");
  const data = {
    value: Number(formData.get("value") ?? 0),
    label: String(formData.get("label") ?? "").trim(),
    labelEn: String(formData.get("labelEn") ?? "").trim() || null,
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
  if (!data.label) throw new Error("label шаардлагатай");

  if (idRaw) {
    await db.update(scoreboardStats).set(data).where(eq(scoreboardStats.id, Number(idRaw)));
  } else {
    await db.insert(scoreboardStats).values(data);
  }
  revalidatePath("/admin/stats");
  revalidatePath("/");
}

export async function deleteStat(id: number) {
  await requireAuth();
  await db.delete(scoreboardStats).where(eq(scoreboardStats.id, id));
  revalidatePath("/admin/stats");
  revalidatePath("/");
}
