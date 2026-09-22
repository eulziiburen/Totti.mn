import { asc } from "drizzle-orm";
import { db } from "@/db/client";
import { rosterPlayers } from "@/db/schema";
import { PlayerForm, PlayerRow } from "./PlayerForm";

export const dynamic = "force-dynamic";

export default async function RosterAdminPage() {
  const players = await db.select().from(rosterPlayers).orderBy(asc(rosterPlayers.sortOrder));

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl uppercase">Тамирчид</h1>

      <div className="mb-8 border border-line-strong bg-bg-0">
        {players.map((p) => (
          <PlayerRow key={p.id} player={p} />
        ))}
        {players.length === 0 && (
          <p className="px-5 py-6 text-center text-muted">Тамирчин алга.</p>
        )}
      </div>

      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">Шинэ тамирчин нэмэх</h2>
      <PlayerForm />
    </div>
  );
}
