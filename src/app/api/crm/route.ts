import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { crmDocs } from "@/db/schema";
import { isCrmAuthenticated } from "@/lib/crm-auth";

// Data API for the CRM page (public/crm/app.html). /api is outside the proxy matcher,
// so every handler checks the CRM session itself.

const COLLECTIONS = ["players", "clubs", "deals", "todos"] as const;
type Collection = (typeof COLLECTIONS)[number];

const isCollection = (v: unknown): v is Collection =>
  typeof v === "string" && (COLLECTIONS as readonly string[]).includes(v);
const isDocId = (v: unknown): v is string => typeof v === "string" && /^[A-Za-z0-9_-]{1,64}$/.test(v);
const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const unauthorized = () => NextResponse.json({ error: "unauthorized" }, { status: 401 });
const badRequest = (error: string) => NextResponse.json({ error }, { status: 400 });

// Every collection in one response: the page renders cross-references (deals → players/clubs).
export async function GET() {
  if (!(await isCrmAuthenticated())) return unauthorized();
  const rows = await db.select().from(crmDocs);
  const out: Record<Collection, Record<string, unknown>[]> = { players: [], clubs: [], deals: [], todos: [] };
  for (const row of rows) {
    if (!isCollection(row.collection)) continue;
    out[row.collection].push({ ...JSON.parse(row.dataJson), id: row.id });
  }
  return NextResponse.json(out, { headers: { "Cache-Control": "no-store" } });
}

// Body: { op: "add", col, data } | { op: "update", col, id, data } | { op: "delete", col, id }
export async function POST(req: Request) {
  if (!(await isCrmAuthenticated())) return unauthorized();
  const body: unknown = await req.json().catch(() => null);
  if (!isPlainObject(body)) return badRequest("invalid body");
  const { op, col, id, data } = body;
  if (!isCollection(col)) return badRequest("invalid collection");

  if (op === "add") {
    if (!isPlainObject(data)) return badRequest("invalid data");
    const newId = crypto.randomUUID().replace(/-/g, "").slice(0, 20);
    await db.insert(crmDocs).values({ collection: col, id: newId, dataJson: JSON.stringify(stripId(data)) });
    return NextResponse.json({ id: newId });
  }

  if (!isDocId(id)) return badRequest("invalid id");
  const where = and(eq(crmDocs.collection, col), eq(crmDocs.id, id));

  if (op === "update") {
    if (!isPlainObject(data)) return badRequest("invalid data");
    const [existing] = await db.select().from(crmDocs).where(where);
    if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });
    // Merge, like the artifact database's update(): fields not sent are kept.
    const merged = { ...JSON.parse(existing.dataJson), ...stripId(data) };
    await db
      .update(crmDocs)
      .set({ dataJson: JSON.stringify(merged), updatedAt: new Date().toISOString() })
      .where(where);
    return NextResponse.json({ id });
  }

  if (op === "delete") {
    await db.delete(crmDocs).where(where);
    return NextResponse.json({ id });
  }

  return badRequest("invalid op");
}

// The id lives in its own column, never inside the stored JSON.
function stripId(data: Record<string, unknown>) {
  const rest = { ...data };
  delete rest.id;
  return rest;
}
