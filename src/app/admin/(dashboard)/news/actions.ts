"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { news } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { uploadImage } from "@/lib/upload";
import { newsPath, sanitizeSlug } from "@/lib/paths";

async function requireAuth() {
  if (!(await isAuthenticated())) throw new Error("Not authenticated");
}

function revalidateNews(slug?: string) {
  revalidatePath("/admin/news");
  revalidatePath("/medee");
  if (slug) revalidatePath(newsPath(slug));
}

export async function upsertNews(formData: FormData) {
  await requireAuth();
  const idRaw = formData.get("id");

  let imageUrl = String(formData.get("currentImageUrl") ?? "").trim() || null;
  const imageFile = formData.get("imageFile");
  if (imageFile instanceof File && imageFile.size > 0) {
    imageUrl = await uploadImage(imageFile, "news");
  }

  const data = {
    slug: sanitizeSlug(String(formData.get("slug") ?? "")),
    title: String(formData.get("title") ?? "").trim(),
    titleEn: String(formData.get("titleEn") ?? "").trim() || null,
    summary: String(formData.get("summary") ?? "").trim() || null,
    summaryEn: String(formData.get("summaryEn") ?? "").trim() || null,
    body: String(formData.get("body") ?? "").trim(),
    bodyEn: String(formData.get("bodyEn") ?? "").trim() || null,
    imageUrl,
    publishedAt: String(formData.get("publishedAt") ?? "").trim() || new Date().toISOString().slice(0, 10),
    isPublished: formData.get("isPublished") === "on",
  };
  if (!data.slug || !data.title || !data.body) throw new Error("slug, гарчиг, агуулга шаардлагатай");

  if (idRaw) {
    await db.update(news).set(data).where(eq(news.id, Number(idRaw)));
  } else {
    await db.insert(news).values(data);
  }
  revalidateNews(data.slug);
}

export async function deleteNews(id: number) {
  await requireAuth();
  await db.delete(news).where(eq(news.id, id));
  revalidateNews();
}
