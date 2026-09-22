import { asc } from "drizzle-orm";
import { db } from "@/db/client";
import { scoreboardStats } from "@/db/schema";
import { StatForm, StatRow } from "./StatForm";

export const dynamic = "force-dynamic";

export default async function StatsAdminPage() {
  const rows = await db.select().from(scoreboardStats).orderBy(asc(scoreboardStats.sortOrder));

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl uppercase">Тоон үзүүлэлт</h1>
      <p className="mb-6 max-w-xl text-sm text-muted">
        Нүүр хуудасны &ldquo;34 / 212 / 14 / 11&rdquo; scoreboard мөрөнд харагдах тоо, тайлбарууд.
      </p>
      <div className="mb-8 border border-line-strong bg-bg-0">
        {rows.map((s) => (
          <StatRow key={s.id} stat={s} />
        ))}
        {rows.length === 0 && <p className="px-5 py-6 text-center text-muted">Тоо баримт алга.</p>}
      </div>
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">Шинэ тоо баримт нэмэх</h2>
      <StatForm />
    </div>
  );
}
