"use server";

import { db } from "@/db/client";
import { bookings } from "@/db/schema";

export type CreateBookingInput = {
  role: string;
  dateIso: string;
  dayLabel: string;
  timeSlot: string;
  timeRange: string;
  format: string;
  formatSub: string;
  name: string;
  phone: string;
  email: string;
  message: string;
};

export async function createBooking(input: CreateBookingInput) {
  try {
    await db.insert(bookings).values({
      role: input.role,
      dateIso: input.dateIso,
      dayLabel: input.dayLabel,
      timeSlot: input.timeSlot,
      timeRange: input.timeRange,
      format: input.format,
      formatSub: input.formatSub,
      name: input.name,
      phone: input.phone || null,
      email: input.email || null,
      message: input.message || null,
    });
    return { ok: true as const };
  } catch (err) {
    console.error("createBooking failed", err);
    return { ok: false as const };
  }
}
