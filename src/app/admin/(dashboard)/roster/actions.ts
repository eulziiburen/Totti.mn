"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { rosterPlayers } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { uploadImage } from "@/lib/upload";

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

  let photoUrl = String(formData.get("currentPhotoUrl") ?? "").trim() || null;
  const photoFile = formData.get("photoFile");
  if (photoFile instanceof File && photoFile.size > 0) {
    photoUrl = await uploadImage(photoFile, "roster");
  }

  const data = {
    slug: String(formData.get("slug") ?? "").trim(),
    ghost: String(formData.get("ghost") ?? "").trim(),
    pos: String(formData.get("pos") ?? "").trim(),
    jersey: String(formData.get("jersey") ?? "").trim() || null,
    name: String(formData.get("name") ?? "").trim(),
    team: String(formData.get("team") ?? "").trim(),
    photoUrl,
    statsJson: statsFromForm(formData),
    height: String(formData.get("height") ?? "").trim() || null,
    bio: String(formData.get("bio") ?? "").trim() || null,
    bioEn: String(formData.get("bioEn") ?? "").trim() || null,
    videoUrl: String(formData.get("videoUrl") ?? "").trim() || null,
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
  revalidatePath(`/tamirchid/${data.slug}`);
}

export async function deletePlayer(id: number) {
  await requireAuth();
  await db.delete(rosterPlayers).where(eq(rosterPlayers.id, id));
  revalidatePath("/admin/roster");
  revalidatePath("/");
}
