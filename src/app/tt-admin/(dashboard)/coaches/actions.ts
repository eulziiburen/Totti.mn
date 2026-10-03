"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { coaches } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { uploadImage } from "@/lib/upload";
import { coachPath, sanitizeSlug } from "@/lib/paths";
import { sanitizeLinks } from "@/lib/links";

async function requireAuth() {
  if (!(await isAuthenticated())) throw new Error("Not authenticated");
}

function linksFromForm(formData: FormData) {
  let raw: unknown = [];
  try {
    raw = JSON.parse(String(formData.get("linksJson") ?? "[]"));
  } catch {
    // keep empty
  }
  return JSON.stringify(sanitizeLinks(raw));
}

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

export async function upsertCoach(formData: FormData) {
  await requireAuth();
  const idRaw = formData.get("id");

  let photoUrl = text(formData, "currentPhotoUrl") || null;
  const photoFile = formData.get("photoFile");
  if (photoFile instanceof File && photoFile.size > 0) {
    photoUrl = await uploadImage(photoFile, "coaches");
  }

  const data = {
    slug: sanitizeSlug(text(formData, "slug")),
    name: text(formData, "name"),
    role: text(formData, "role"),
    roleEn: text(formData, "roleEn") || null,
    team: text(formData, "team"),
    photoUrl,
    experience: text(formData, "experience") || null,
    license: text(formData, "license") || null,
    achievements: text(formData, "achievements") || null,
    achievementsEn: text(formData, "achievementsEn") || null,
    bio: text(formData, "bio") || null,
    bioEn: text(formData, "bioEn") || null,
    videoUrl: text(formData, "videoUrl") || null,
    linksJson: linksFromForm(formData),
    sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
    isPublished: formData.get("isPublished") === "on",
  };

  if (!data.slug || !data.name || !data.role) throw new Error("slug, нэр, албан тушаал шаардлагатай");

  if (idRaw) {
    await db.update(coaches).set(data).where(eq(coaches.id, Number(idRaw)));
  } else {
    await db.insert(coaches).values(data);
  }
  revalidatePath("/tt-admin/coaches");
  revalidatePath("/");
  revalidatePath(coachPath(data.slug));
}

export async function deleteCoach(id: number) {
  await requireAuth();
  await db.delete(coaches).where(eq(coaches.id, id));
  revalidatePath("/tt-admin/coaches");
  revalidatePath("/");
}
