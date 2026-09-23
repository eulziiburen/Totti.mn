"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { orderItems, productVariants, products } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { uploadImage } from "@/lib/upload";

async function requireAuth() {
  if (!(await isAuthenticated())) throw new Error("Not authenticated");
}

export async function upsertProduct(formData: FormData) {
  await requireAuth();
  const idRaw = formData.get("id");

  let imageUrl = String(formData.get("currentImageUrl") ?? "").trim() || null;
  const imageFile = formData.get("imageFile");
  if (imageFile instanceof File && imageFile.size > 0) {
    imageUrl = await uploadImage(imageFile, "products");
  }

  const data = {
    slug: String(formData.get("slug") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    imageUrl,
    basePrice: Number(formData.get("basePrice") ?? 0),
    isActive: formData.get("isActive") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };

  if (!data.slug || !data.name) throw new Error("slug, нэр шаардлагатай");
  if (!Number.isFinite(data.basePrice) || data.basePrice < 0) throw new Error("Үнэ буруу байна");

  if (idRaw) {
    await db.update(products).set(data).where(eq(products.id, Number(idRaw)));
  } else {
    await db.insert(products).values(data);
  }
  revalidatePath("/admin/products");
  revalidatePath("/delguur");
}

export async function deleteProduct(id: number) {
  await requireAuth();

  const variants = await db.select().from(productVariants).where(eq(productVariants.productId, id));
  for (const v of variants) {
    const referenced = await db.select().from(orderItems).where(eq(orderItems.variantId, v.id));
    if (referenced.length > 0) {
      throw new Error("Энэ бараагаар захиалга хийгдсэн тул устгах боломжгүй. Идэвхгүй болгоно уу.");
    }
  }

  await db.delete(productVariants).where(eq(productVariants.productId, id));
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/admin/products");
  revalidatePath("/delguur");
}
