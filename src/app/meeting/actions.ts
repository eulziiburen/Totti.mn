"use server";

import { db } from "@/db/client";
import { bookings } from "@/db/schema";
import { SITE_ACTOR, addCrmDoc } from "@/lib/crm-store";

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
    await addMeetingTodo(input);
    return { ok: true as const };
  } catch (err) {
    console.error("createBooking failed", err);
    return { ok: false as const };
  }
}

// Puts the request on the team's CRM task list. Best effort: the booking is already saved,
// so a CRM failure must not turn into an error for the visitor.
async function addMeetingTodo(input: CreateBookingInput) {
  try {
    const contact = [input.phone, input.email].filter(Boolean).join(" · ");
    await addCrmDoc(SITE_ACTOR, "todos", {
      title: `Уулзалтын хүсэлт: ${input.name} (${input.role}) — ${input.dayLabel} ${input.timeRange}, ${input.format}`,
      area: "Уулзалтын хүсэлт",
      owner: "",
      due: input.dateIso.slice(0, 10),
      progress: [contact, input.message].filter(Boolean).join("\n"),
      done: false,
      order: Date.now(),
    });
  } catch (err) {
    console.error("addMeetingTodo failed", err);
  }
}
