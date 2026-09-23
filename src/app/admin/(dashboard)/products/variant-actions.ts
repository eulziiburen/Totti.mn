"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { orderItems, productVariants } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";

async function requireAuth() {
  if (!(await isAuthenticated())) throw new Error("Not authenticated");
}

export async function upsertVariant(formData: FormData) {
  await requireAuth();
  const idRaw = formData.get("id");
  const productId = Number(formData.get("productId"));

  const priceOverrideRaw = String(formData.get("priceOverride") ?? "").trim();
  const data = {
    productId,
    size: String(formData.get("size") ?? "").trim() || null,
    color: String(formData.get("color") ?? "").trim() || null,
    sku: String(formData.get("sku") ?? "").trim() || null,
    priceOverride: priceOverrideRaw ? Number(priceOverrideRaw) : null,
    stock: Number(formData.get("stock") ?? 0),
    isActive: formData.get("isActive") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };

  if (!productId) throw new Error("productId шаардлагатай");
  if (!Number.isFinite(data.stock) || data.stock < 0) throw new Error("Үлдэгдэл буруу байна");

  if (idRaw) {
    await db.update(productVariants).set(data).where(eq(productVariants.id, Number(idRaw)));
  } else {
    await db.insert(productVariants).values(data);
  }
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/delguur");
}

export async function deleteVariant(id: number, productId: number) {
  await requireAuth();

  const referenced = await db.select().from(orderItems).where(eq(orderItems.variantId, id));
  if (referenced.length > 0) {
    throw new Error("Энэ хувилбараар захиалга хийгдсэн тул устгах боломжгүй. Идэвхгүй болгоно уу.");
  }

  await db.delete(productVariants).where(eq(productVariants.id, id));
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/delguur");
}
