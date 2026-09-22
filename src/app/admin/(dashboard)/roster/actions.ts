"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { rosterPlayers } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";

async function requireAuth() {
  if (!(await isAuthenticated())) throw new Error("Not authenticated");
}

function statsFromForm(formData: FormData) {
  const stats: { label: string; value: string }[] = [];
  for (let i = 1; i <= 3; i++) {
    const label = String(formData.get(`statLabel${i}`) ?? "").trim();
    const value = String(formData.get(`statValue${i}`) ?? "").trim();
    if (label && value) stats.push({ label, value });
  }
  return JSON.stringify(stats);
}

export async function upsertPlayer(formData: FormData) {
  await requireAuth();
  const idRaw = formData.get("id");
  const data = {
    slug: String(formData.get("slug") ?? "").trim(),
    ghost: String(formData.get("ghost") ?? "").trim(),
    pos: String(formData.get("pos") ?? "").trim(),
    jersey: String(formData.get("jersey") ?? "").trim() || null,
    name: String(formData.get("name") ?? "").trim(),
    team: String(formData.get("team") ?? "").trim(),
    photoUrl: String(formData.get("photoUrl") ?? "").trim() || null,
    statsJson: statsFromForm(formData),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };

  if (!data.slug || !data.name) throw new Error("slug, name шаардлагатай");

  if (idRaw) {
    await db.update(rosterPlayers).set(data).where(eq(rosterPlayers.id, Number(idRaw)));
  } else {
    await db.insert(rosterPlayers).values(data);
  }
  revalidatePath("/admin/roster");
  revalidatePath("/");
}

export async function deletePlayer(id: number) {
  await requireAuth();
  await db.delete(rosterPlayers).where(eq(rosterPlayers.id, id));
  revalidatePath("/admin/roster");
  revalidatePath("/");
}
