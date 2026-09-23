"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { productImages } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { uploadImage } from "@/lib/upload";

async function requireAuth() {
  if (!(await isAuthenticated())) throw new Error("Not authenticated");
}

export async function addProductImage(formData: FormData) {
  await requireAuth();
  const productId = Number(formData.get("productId"));
  const file = formData.get("imageFile");
  if (!productId) throw new Error("productId шаардлагатай");
  if (!(file instanceof File) || file.size === 0) throw new Error("Зураг сонгоно уу.");

  const url = await uploadImage(file, "products");
  await db.insert(productImages).values({ productId, url });
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/delguur");
}

export async function deleteProductImage(id: number, productId: number) {
  await requireAuth();
  await db.delete(productImages).where(eq(productImages.id, id));
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/delguur");
}
