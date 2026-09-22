import { asc } from "drizzle-orm";
import { db } from "@/db/client";
import { partners } from "@/db/schema";
import { PartnerForm, PartnerRow } from "./PartnerForm";

export const dynamic = "force-dynamic";

export default async function PartnersAdminPage() {
  const rows = await db.select().from(partners).orderBy(asc(partners.sortOrder));

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl uppercase">Түнш байгууллага</h1>
      <div className="mb-8 border border-line-strong bg-bg-0">
        {rows.map((p) => (
          <PartnerRow key={p.id} partner={p} />
        ))}
        {rows.length === 0 && <p className="px-5 py-6 text-center text-muted">Түнш алга.</p>}
      </div>
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">Шинэ түнш нэмэх</h2>
      <PartnerForm />
    </div>
  );
}
