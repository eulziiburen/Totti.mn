"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { services } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";

async function requireAuth() {
  if (!(await isAuthenticated())) throw new Error("Not authenticated");
}

export async function upsertService(formData: FormData) {
  await requireAuth();
  const idRaw = formData.get("id");
  const data = {
    idx: String(formData.get("idx") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    iconPath: String(formData.get("iconPath") ?? "").trim(),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
  if (!data.title || !data.description) throw new Error("title, description шаардлагатай");

  if (idRaw) {
    await db.update(services).set(data).where(eq(services.id, Number(idRaw)));
  } else {
    await db.insert(services).values(data);
  }
  revalidatePath("/admin/services");
  revalidatePath("/");
}

export async function deleteService(id: number) {
  await requireAuth();
  await db.delete(services).where(eq(services.id, id));
  revalidatePath("/admin/services");
  revalidatePath("/");
}
