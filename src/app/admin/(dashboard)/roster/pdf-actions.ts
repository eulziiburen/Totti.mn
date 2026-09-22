"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { playerDocuments } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { uploadPdf } from "@/lib/upload";
import type { PdfKey } from "@/lib/data";

async function requireAuth() {
  if (!(await isAuthenticated())) throw new Error("Not authenticated");
}

export async function uploadPlayerDocument(key: PdfKey, formData: FormData) {
  await requireAuth();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("PDF файл сонгоно уу.");
  }
  const url = await uploadPdf(file, "documents");
  const label = key === "male" ? "Эрэгтэй" : "Эмэгтэй";

  const existing = await db.select().from(playerDocuments).where(eq(playerDocuments.key, key));
  if (existing.length > 0) {
    await db
      .update(playerDocuments)
      .set({ url, fileName: file.name, label })
      .where(eq(playerDocuments.key, key));
  } else {
    await db.insert(playerDocuments).values({ key, label, fileName: file.name, url });
  }

  revalidatePath("/admin/roster");
  revalidatePath("/", "layout");
}
