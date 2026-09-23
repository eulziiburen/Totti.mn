"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { customers, orders } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";

async function requireAuth() {
  if (!(await isAuthenticated())) throw new Error("Not authenticated");
}

export async function deleteCustomer(id: number) {
  await requireAuth();
  // Detach (not delete) their past orders — orders keep their own name/phone/email
  // snapshot already, so they remain fully readable after the account is removed.
  await db.update(orders).set({ customerId: null }).where(eq(orders.customerId, id));
  await db.delete(customers).where(eq(customers.id, id));
  revalidatePath("/admin/customers");
}
