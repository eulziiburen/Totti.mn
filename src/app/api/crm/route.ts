import { NextResponse } from "next/server";
import { desc, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { crmAudit, crmDocs, crmOfferViews } from "@/db/schema";
import { getCrmUser } from "@/lib/crm-auth";
import {
  addCrmDoc,
  deleteCrmDoc,
  getCrmDoc,
  isCrmCollection,
  isCrmDocId,
  updateCrmDoc,
  type CrmCollection,
  type CrmDoc,
} from "@/lib/crm-store";

// Data API for the CRM page (public/crm/app.html). /api is outside the proxy matcher,
// so every handler checks the CRM session itself.

// How many change-log entries the page gets with each load.
const AUDIT_LIMIT = 300;

const isPlainObject = (v: unknown): v is CrmDoc =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const unauthorized = () => NextResponse.json({ error: "unauthorized" }, { status: 401 });
const badRequest = (error: string) => NextResponse.json({ error }, { status: 400 });
const notFound = () => NextResponse.json({ error: "not found" }, { status: 404 });

// Every collection in one response: the page renders cross-references (deals → players/clubs).
// Also returns who is signed in, the latest change-log entries and offer-page views per club.
export async function GET() {
  const me = await getCrmUser();
  if (!me) return unauthorized();
  const [rows, auditRows, viewRows] = await Promise.all([
    db.select().from(crmDocs),
    db.select().from(crmAudit).orderBy(desc(crmAudit.id)).limit(AUDIT_LIMIT),
    db
      .select({ clubId: crmOfferViews.clubId, count: sql<number>`count(*)`, last: sql<string>`max(${crmOfferViews.at})` })
      .from(crmOfferViews)
      .groupBy(crmOfferViews.clubId),
  ]);
  const out: Record<CrmCollection, CrmDoc[]> = { players: [], clubs: [], deals: [], todos: [] };
  for (const row of rows) {
    if (!isCrmCollection(row.collection)) continue;
    out[row.collection].push({ ...JSON.parse(row.dataJson), id: row.id });
  }
  const audit = auditRows.map(({ changesJson, ...a }) => ({ ...a, changes: JSON.parse(changesJson) }));
  const offerViews = Object.fromEntries(viewRows.map((v) => [v.clubId, { count: v.count, last: v.last }]));
  return NextResponse.json({ ...out, me, audit, offerViews }, { headers: { "Cache-Control": "no-store" } });
}

// Body: { op: "add", col, data } | { op: "update", col, id, data } | { op: "delete", col, id }
//     | { op: "share", col: "clubs", id } → gives the club an offer-page token (kept if it has one)
export async function POST(req: Request) {
  const actor = await getCrmUser();
  if (!actor) return unauthorized();
  const body: unknown = await req.json().catch(() => null);
  if (!isPlainObject(body)) return badRequest("invalid body");
  const { op, col, id, data } = body;
  if (!isCrmCollection(col)) return badRequest("invalid collection");

  if (op === "add") {
    if (!isPlainObject(data)) return badRequest("invalid data");
    return NextResponse.json({ id: await addCrmDoc(actor, col, data) });
  }

  if (!isCrmDocId(id)) return badRequest("invalid id");

  if (op === "update") {
    if (!isPlainObject(data)) return badRequest("invalid data");
    return (await updateCrmDoc(actor, col, id, data)) ? NextResponse.json({ id }) : notFound();
  }

  if (op === "delete") {
    return (await deleteCrmDoc(actor, col, id)) ? NextResponse.json({ id }) : notFound();
  }

  if (op === "share" && col === "clubs") {
    const club = await getCrmDoc("clubs", id);
    if (!club) return notFound();
    if (typeof club.shareToken === "string" && club.shareToken) return NextResponse.json({ token: club.shareToken });
    // Unguessable, since the offer page is public to whoever has the link.
    const token = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    await updateCrmDoc(actor, "clubs", id, { shareToken: token });
    return NextResponse.json({ token });
  }

  return badRequest("invalid op");
}
