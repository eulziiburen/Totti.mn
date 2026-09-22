"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { partners } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { uploadImage } from "@/lib/upload";

async function requireAuth() {
  if (!(await isAuthenticated())) throw new Error("Not authenticated");
}

export async function upsertPartner(formData: FormData) {
  await requireAuth();
  const idRaw = formData.get("id");

  let logoUrl = String(formData.get("currentLogoUrl") ?? "").trim();
  const logoFile = formData.get("logoFile");
  if (logoFile instanceof File && logoFile.size > 0) {
    logoUrl = await uploadImage(logoFile, "partners");
  }

  const data = {
    name: String(formData.get("name") ?? "").trim(),
    logoUrl,
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
  if (!data.name || !data.logoUrl) throw new Error("name, лого зураг шаардлагатай");

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
