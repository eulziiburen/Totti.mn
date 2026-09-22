import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const bookings = sqliteTable("bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  role: text("role").notNull(),
  dateIso: text("date_iso").notNull(),
  dayLabel: text("day_label").notNull(),
  timeSlot: text("time_slot").notNull(),
  timeRange: text("time_range").notNull(),
  format: text("format").notNull(),
  formatSub: text("format_sub").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email"),
  message: text("message"),
  status: text("status").notNull().default("new"), // new | contacted | confirmed | declined
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const rosterPlayers = sqliteTable("roster_players", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  ghost: text("ghost").notNull(),
  pos: text("pos").notNull(),
  jersey: text("jersey"),
  name: text("name").notNull(),
  team: text("team").notNull(),
  photoUrl: text("photo_url"),
  statsJson: text("stats_json").notNull().default("[]"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const partners = sqliteTable("partners", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  logoUrl: text("logo_url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const services = sqliteTable("services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  idx: text("idx").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  iconPath: text("icon_path").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});
