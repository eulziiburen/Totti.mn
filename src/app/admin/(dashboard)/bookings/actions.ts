"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { bookings } from "@/db/schema";
import { isAuthenticated } from "@/lib/auth";

async function requireAuth() {
  if (!(await isAuthenticated())) throw new Error("Not authenticated");
}

export async function updateBookingStatus(id: number, status: string) {
  await requireAuth();
  await db.update(bookings).set({ status }).where(eq(bookings.id, id));
  revalidatePath("/admin/bookings");
}

export async function deleteBooking(id: number) {
  await requireAuth();
  await db.delete(bookings).where(eq(bookings.id, id));
  revalidatePath("/admin/bookings");
}
