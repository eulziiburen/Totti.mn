import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { crmAudit, crmDocs } from "@/db/schema";

// CRM documents (players, clubs, deals, todos) and their change log. Every write goes
// through here so it is logged, whether it comes from the CRM page or from the site.

export const CRM_COLLECTIONS = ["players", "clubs", "deals", "todos"] as const;
export type CrmCollection = (typeof CRM_COLLECTIONS)[number];
export type CrmDoc = Record<string, unknown>;
type Changes = Record<string, [unknown, unknown]>;

// Actor recorded for writes the website makes on its own (e.g. a meeting request).
export const SITE_ACTOR = "totti.mn сайт";

export const isCrmCollection = (v: unknown): v is CrmCollection =>
  typeof v === "string" && (CRM_COLLECTIONS as readonly string[]).includes(v);
export const isCrmDocId = (v: unknown): v is string =>
  typeof v === "string" && /^[A-Za-z0-9_-]{1,64}$/.test(v);

const newId = () => crypto.randomUUID().replace(/-/g, "").slice(0, 20);
const whereDoc = (col: CrmCollection, id: string) => and(eq(crmDocs.collection, col), eq(crmDocs.id, id));

export async function getCrmDoc(col: CrmCollection, id: string): Promise<CrmDoc | null> {
  const [row] = await db.select().from(crmDocs).where(whereDoc(col, id));
  return row ? JSON.parse(row.dataJson) : null;
}

export async function listCrmDocs(col: CrmCollection): Promise<(CrmDoc & { id: string })[]> {
  const rows = await db.select().from(crmDocs).where(eq(crmDocs.collection, col));
  return rows.map((r) => ({ ...JSON.parse(r.dataJson), id: r.id }));
}

// Finds the one document whose JSON has `field` equal to `value` (e.g. a club by its share token).
export async function findCrmDocBy(
  col: CrmCollection,
  field: string,
  value: string
): Promise<(CrmDoc & { id: string }) | null> {
  const [row] = await db
    .select()
    .from(crmDocs)
    .where(and(eq(crmDocs.collection, col), sql`json_extract(${crmDocs.dataJson}, ${"$." + field}) = ${value}`))
    .limit(1);
  return row ? { ...JSON.parse(row.dataJson), id: row.id } : null;
}

export async function addCrmDoc(actor: string, col: CrmCollection, data: CrmDoc): Promise<string> {
  const id = newId();
  const doc = stripId(data);
  await db.insert(crmDocs).values({ collection: col, id, dataJson: JSON.stringify(doc) });
  await logChange(actor, "add", col, id, doc, diff({}, doc));
  return id;
}

// Merges `data` into the document, like the artifact database's update(). Returns false if it doesn't exist.
export async function updateCrmDoc(actor: string, col: CrmCollection, id: string, data: CrmDoc): Promise<boolean> {
  const before = await getCrmDoc(col, id);
  if (!before) return false;
  const merged = { ...before, ...stripId(data) };
  const changes = diff(before, merged);
  if (Object.keys(changes).length === 0) return true;
  await db
    .update(crmDocs)
    .set({ dataJson: JSON.stringify(merged), updatedAt: new Date().toISOString() })
    .where(whereDoc(col, id));
  await logChange(actor, "update", col, id, merged, changes);
  return true;
}

export async function deleteCrmDoc(actor: string, col: CrmCollection, id: string): Promise<boolean> {
  const before = await getCrmDoc(col, id);
  if (!before) return false;
  await db.delete(crmDocs).where(whereDoc(col, id));
  // The full old record goes into the log, so a mistaken delete can be re-entered.
  await logChange(actor, "delete", col, id, before, diff(before, {}));
  return true;
}

// The id lives in its own column, never inside the stored JSON.
function stripId(data: CrmDoc) {
  const rest = { ...data };
  delete rest.id;
  return rest;
}

const isEmpty = (v: unknown) => v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);

// Fields whose value changed, as { field: [before, after] }. `order` is internal sorting, not a user edit.
function diff(before: CrmDoc, after: CrmDoc): Changes {
  const changes: Changes = {};
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
  col: CrmCollection,
  docId: string,
  doc: CrmDoc,
  changes: Changes
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
async function labelFor(col: CrmCollection, doc: CrmDoc): Promise<string> {
  if (col === "players" || col === "clubs") return String(doc.name ?? "");
  if (col === "todos") return String(doc.title ?? "").slice(0, 120);
  const nameOf = async (c: CrmCollection, id: unknown) => {
    if (!isCrmDocId(id)) return "?";
    const d = await getCrmDoc(c, id);
    return d ? String(d.name ?? "?") : "?";
  };
  return `${await nameOf("players", doc.playerId)} → ${await nameOf("clubs", doc.clubId)}`;
}
