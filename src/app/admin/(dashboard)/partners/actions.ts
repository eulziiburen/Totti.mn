"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { partners } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";

async function requireAuth() {
  if (!(await isAuthenticated())) throw new Error("Not authenticated");
}

export async function upsertPartner(formData: FormData) {
  await requireAuth();
  const idRaw = formData.get("id");
  const data = {
    name: String(formData.get("name") ?? "").trim(),
    logoUrl: String(formData.get("logoUrl") ?? "").trim(),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
  if (!data.name || !data.logoUrl) throw new Error("name, logoUrl шаардлагатай");

  if (idRaw) {
    await db.update(partners).set(data).where(eq(partners.id, Number(idRaw)));
  } else {
    await db.insert(partners).values(data);
  }
  revalidatePath("/admin/partners");
  revalidatePath("/");
}

export async function deletePartner(id: number) {
  await requireAuth();
  await db.delete(partners).where(eq(partners.id, id));
  revalidatePath("/admin/partners");
  revalidatePath("/");
}
