import { asc } from "drizzle-orm";
import { db } from "@/db/client";
import { coaches } from "@/db/schema";
import { CoachForm, CoachListRow } from "./CoachForm";

export const dynamic = "force-dynamic";

export default async function CoachesAdminPage() {
  const rows = await db.select().from(coaches).orderBy(asc(coaches.sortOrder), asc(coaches.id));

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl uppercase">Дасгалжуулагчид</h1>
      <p className="mb-6 text-sm text-muted">Нийтэлсэн дасгалжуулагч байвал нүүр хуудсанд “Дасгалжуулагчид” хэсэг гарна.</p>

      <div className="mb-8 border border-line-strong bg-bg-0">
        {rows.map((c) => (
          <CoachListRow key={c.id} coach={c} />
        ))}
        {rows.length === 0 && <p className="px-5 py-6 text-center text-muted">Дасгалжуулагч алга.</p>}
      </div>

      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">Шинэ дасгалжуулагч нэмэх</h2>
      <CoachForm />
    </div>
  );
}
