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
  height: text("height"),
  bio: text("bio"),
  videoUrl: text("video_url"),
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

export const scoreboardStats = sqliteTable("scoreboard_stats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  value: integer("value").notNull(),
  label: text("label").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const playerDocuments = sqliteTable("player_documents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(), // "male" | "female"
  label: text("label").notNull(),
  fileName: text("file_name").notNull(),
  url: text("url").notNull(),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  basePrice: integer("base_price").notNull(), // MNT, whole tugrug
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const productVariants = sqliteTable("product_variants", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  size: text("size"),
  color: text("color"),
  sku: text("sku"),
  priceOverride: integer("price_override"), // null => use product.basePrice
  stock: integer("stock").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const productImages = sqliteTable("product_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const customers = sqliteTable("customers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  resetTokenHash: text("reset_token_hash"),
  resetTokenExpiresAt: text("reset_token_expires_at"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderNo: text("order_no").notNull().unique(),
  customerId: integer("customer_id").references(() => customers.id), // null = guest checkout
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email"),
  deliveryAddress: text("delivery_address"),
  note: text("note"),
  subtotal: integer("subtotal").notNull(),
  total: integer("total").notNull(),
  status: text("status").notNull().default("pending"), // pending | paid | failed | cancelled | fulfilled
  qpayInvoiceId: text("qpay_invoice_id"),
  qpayQrText: text("qpay_qr_text"),
  qpayQrImage: text("qpay_qr_image"),
  qpayShortUrl: text("qpay_short_url"),
  paidAt: text("paid_at"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const orderItems = sqliteTable("order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  variantId: integer("variant_id")
    .notNull()
    .references(() => productVariants.id),
  productName: text("product_name").notNull(),
  variantLabel: text("variant_label").notNull(),
  unitPrice: integer("unit_price").notNull(),
  quantity: integer("quantity").notNull(),
  lineTotal: integer("line_total").notNull(),
});
