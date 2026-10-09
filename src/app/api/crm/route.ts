import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { crmAudit, crmDocs } from "@/db/schema";
import { getCrmUser } from "@/lib/crm-auth";

// Data API for the CRM page (public/crm/app.html). /api is outside the proxy matcher,
// so every handler checks the CRM session itself.

const COLLECTIONS = ["players", "clubs", "deals", "todos"] as const;
type Collection = (typeof COLLECTIONS)[number];
type Doc = Record<string, unknown>;

// How many change-log entries the page gets with each load.
const AUDIT_LIMIT = 300;

const isCollection = (v: unknown): v is Collection =>
  typeof v === "string" && (COLLECTIONS as readonly string[]).includes(v);
const isDocId = (v: unknown): v is string => typeof v === "string" && /^[A-Za-z0-9_-]{1,64}$/.test(v);
const isPlainObject = (v: unknown): v is Doc =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const unauthorized = () => NextResponse.json({ error: "unauthorized" }, { status: 401 });
const badRequest = (error: string) => NextResponse.json({ error }, { status: 400 });

// Every collection in one response: the page renders cross-references (deals → players/clubs).
// Also returns who is signed in and the latest change-log entries.
export async function GET() {
  const me = await getCrmUser();
  if (!me) return unauthorized();
  const [rows, auditRows] = await Promise.all([
    db.select().from(crmDocs),
    db.select().from(crmAudit).orderBy(desc(crmAudit.id)).limit(AUDIT_LIMIT),
  ]);
  const out: Record<Collection, Doc[]> = { players: [], clubs: [], deals: [], todos: [] };
  for (const row of rows) {
    if (!isCollection(row.collection)) continue;
    out[row.collection].push({ ...JSON.parse(row.dataJson), id: row.id });
  }
  const audit = auditRows.map(({ changesJson, ...a }) => ({ ...a, changes: JSON.parse(changesJson) }));
  return NextResponse.json({ ...out, me, audit }, { headers: { "Cache-Control": "no-store" } });
}

// Body: { op: "add", col, data } | { op: "update", col, id, data } | { op: "delete", col, id }
export async function POST(req: Request) {
  const actor = await getCrmUser();
  if (!actor) return unauthorized();
  const body: unknown = await req.json().catch(() => null);
  if (!isPlainObject(body)) return badRequest("invalid body");
  const { op, col, id, data } = body;
  if (!isCollection(col)) return badRequest("invalid collection");

  if (op === "add") {
    if (!isPlainObject(data)) return badRequest("invalid data");
    const newId = crypto.randomUUID().replace(/-/g, "").slice(0, 20);
    const doc = stripId(data);
    await db.insert(crmDocs).values({ collection: col, id: newId, dataJson: JSON.stringify(doc) });
    await logChange(actor, "add", col, newId, doc, diff({}, doc));
    return NextResponse.json({ id: newId });
  }

  if (!isDocId(id)) return badRequest("invalid id");
  const where = and(eq(crmDocs.collection, col), eq(crmDocs.id, id));
  const [existing] = await db.select().from(crmDocs).where(where);
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });
  const before: Doc = JSON.parse(existing.dataJson);

  if (op === "update") {
    if (!isPlainObject(data)) return badRequest("invalid data");
    // Merge, like the artifact database's update(): fields not sent are kept.
    const merged = { ...before, ...stripId(data) };
    const changes = diff(before, merged);
    if (Object.keys(changes).length === 0) return NextResponse.json({ id });
    await db
      .update(crmDocs)
      .set({ dataJson: JSON.stringify(merged), updatedAt: new Date().toISOString() })
      .where(where);
    await logChange(actor, "update", col, id, merged, changes);
    return NextResponse.json({ id });
  }

  if (op === "delete") {
    await db.delete(crmDocs).where(where);
    // The full old record goes into the log, so a mistaken delete can be re-entered.
    await logChange(actor, "delete", col, id, before, diff(before, {}));
    return NextResponse.json({ id });
  }

  return badRequest("invalid op");
}

// The id lives in its own column, never inside the stored JSON.
function stripId(data: Doc) {
  const rest = { ...data };
  delete rest.id;
  return rest;
}

const isEmpty = (v: unknown) => v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);

// Fields whose value changed, as { field: [before, after] }. `order` is internal sorting, not a user edit.
function diff(before: Doc, after: Doc): Record<string, [unknown, unknown]> {
  const changes: Record<string, [unknown, unknown]> = {};
  for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
    if (key === "order") continue;
    const a = before[key];
    const b = after[key];
    if (isEmpty(a) && isEmpty(b)) continue;
    if (JSON.stringify(a) !== JSON.stringify(b)) changes[key] = [a ?? null, b ?? null];
  }
  return changes;
}

async function logChange(
  actor: string,
  action: "add" | "update" | "delete",
  col: Collection,
  docId: string,
  doc: Doc,
  changes: Record<string, [unknown, unknown]>
) {
  await db.insert(crmAudit).values({
    at: new Date().toISOString(),
    actor,
    action,
    collection: col,
    docId,
    label: await labelFor(col, doc),
    changesJson: JSON.stringify(changes),
  });
}

// A readable name for the record, kept in the log so it still reads after a delete.
async function labelFor(col: Collection, doc: Doc): Promise<string> {
  if (col === "players" || col === "clubs") return String(doc.name ?? "");
  if (col === "todos") return String(doc.title ?? "").slice(0, 120);
  const nameOf = async (c: Collection, id: unknown) => {
    if (!isDocId(id)) return "?";
    const [row] = await db
      .select()
      .from(crmDocs)
      .where(and(eq(crmDocs.collection, c), eq(crmDocs.id, id)));
    return row ? String(JSON.parse(row.dataJson).name ?? "?") : "?";
  };
  return `${await nameOf("players", doc.playerId)} → ${await nameOf("clubs", doc.clubId)}`;
}
