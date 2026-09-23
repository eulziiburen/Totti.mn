import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import {
  partners as partnersTable,
  playerDocuments as playerDocumentsTable,
  productImages as productImagesTable,
  productVariants as productVariantsTable,
  products as productsTable,
  rosterPlayers as rosterTable,
  scoreboardStats as scoreboardStatsTable,
  services as servicesTable,
} from "@/db/schema";
import {
  partners as staticPartners,
  pdfDocuments as staticPdfDocuments,
  rosterPlayers as staticRoster,
  scoreboardStats as staticScoreboardStats,
  services as staticServices,
  type Partner,
  type PdfDocuments,
  type RosterPlayer,
  type ServiceItem,
  type Stat,
} from "./data";

export async function getRosterPlayers(): Promise<RosterPlayer[]> {
  try {
    const rows = await db.select().from(rosterTable).orderBy(asc(rosterTable.sortOrder));
    if (rows.length === 0) return staticRoster;
    return rows.map((r) => ({
      id: r.slug,
      ghost: r.ghost,
      pos: r.pos,
      jersey: r.jersey ?? undefined,
      name: r.name,
      team: r.team,
      photo: r.photoUrl ?? undefined,
      stats: JSON.parse(r.statsJson || "[]"),
    }));
  } catch (err) {
    console.error("getRosterPlayers failed, falling back to static data", err);
    return staticRoster;
  }
}

export async function getPartners(): Promise<Partner[]> {
  try {
    const rows = await db.select().from(partnersTable).orderBy(asc(partnersTable.sortOrder));
    if (rows.length === 0) return staticPartners;
    return rows.map((p) => ({ name: p.name, src: p.logoUrl }));
  } catch (err) {
    console.error("getPartners failed, falling back to static data", err);
    return staticPartners;
  }
}

export async function getServices(): Promise<ServiceItem[]> {
  try {
    const rows = await db.select().from(servicesTable).orderBy(asc(servicesTable.sortOrder));
    if (rows.length === 0) return staticServices;
    return rows.map((s) => ({
      idx: s.idx,
      title: s.title,
      desc: s.description,
      path: s.iconPath,
    }));
  } catch (err) {
    console.error("getServices failed, falling back to static data", err);
    return staticServices;
  }
}

export async function getScoreboardStats(): Promise<Stat[]> {
  try {
    const rows = await db
      .select()
      .from(scoreboardStatsTable)
      .orderBy(asc(scoreboardStatsTable.sortOrder));
    if (rows.length === 0) return staticScoreboardStats;
    return rows.map((s) => ({ value: s.value, label: s.label }));
  } catch (err) {
    console.error("getScoreboardStats failed, falling back to static data", err);
    return staticScoreboardStats;
  }
}

export type ProductVariant = {
  id: number;
  size: string | null;
  color: string | null;
  price: number;
  stock: number;
};

export type ProductSummary = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  basePrice: number;
  minPrice: number;
  inStock: boolean;
};

export type ProductDetail = ProductSummary & { variants: ProductVariant[]; images: string[] };

export async function getProducts(query?: string): Promise<ProductSummary[]> {
  try {
    let rows = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.isActive, true))
      .orderBy(asc(productsTable.sortOrder));
    // Filtered in JS rather than SQL LIKE — sqlite's LIKE is ASCII-only
    // case-insensitive and would miss Cyrillic-case variants of the query.
    const q = query?.trim().toLowerCase();
    if (q) rows = rows.filter((p) => p.name.toLowerCase().includes(q));
    if (rows.length === 0) return [];

    const variantRows = await db
      .select()
      .from(productVariantsTable)
      .where(eq(productVariantsTable.isActive, true));

    return rows.map((p) => {
      const variants = variantRows.filter((v) => v.productId === p.id);
      const prices = variants.length > 0 ? variants.map((v) => v.priceOverride ?? p.basePrice) : [p.basePrice];
      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description,
        imageUrl: p.imageUrl,
        basePrice: p.basePrice,
        minPrice: Math.min(...prices),
        inStock: variants.some((v) => v.stock > 0),
      };
    });
  } catch (err) {
    console.error("getProducts failed", err);
    return [];
  }
}

export async function getProduct(slug: string): Promise<ProductDetail | null> {
  try {
    const [p] = await db
      .select()
      .from(productsTable)
      .where(and(eq(productsTable.slug, slug), eq(productsTable.isActive, true)));
    if (!p) return null;

    const [variants, galleryRows] = await Promise.all([
      db
        .select()
        .from(productVariantsTable)
        .where(and(eq(productVariantsTable.productId, p.id), eq(productVariantsTable.isActive, true)))
        .orderBy(asc(productVariantsTable.sortOrder)),
      db
        .select()
        .from(productImagesTable)
        .where(eq(productImagesTable.productId, p.id))
        .orderBy(asc(productImagesTable.sortOrder)),
    ]);

    const mapped = variants.map((v) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      price: v.priceOverride ?? p.basePrice,
      stock: v.stock,
    }));
    const prices = mapped.length > 0 ? mapped.map((v) => v.price) : [p.basePrice];

    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description,
      imageUrl: p.imageUrl,
      basePrice: p.basePrice,
      minPrice: Math.min(...prices),
      inStock: mapped.some((v) => v.stock > 0),
      variants: mapped,
      images: [p.imageUrl, ...galleryRows.map((g) => g.url)].filter((u): u is string => !!u),
    };
  } catch (err) {
    console.error("getProduct failed", err);
    return null;
  }
}

export async function getPlayerDocuments(): Promise<PdfDocuments> {
  try {
    const rows = await db.select().from(playerDocumentsTable);
    if (rows.length === 0) return staticPdfDocuments;
    const result: PdfDocuments = { ...staticPdfDocuments };
    for (const row of rows) {
      const key = row.key;
      if (key === "male" || key === "female") {
        result[key] = { name: row.fileName, url: row.url, label: row.label };
      }
    }
    return result;
  } catch (err) {
    console.error("getPlayerDocuments failed, falling back to static data", err);
    return staticPdfDocuments;
  }
}
