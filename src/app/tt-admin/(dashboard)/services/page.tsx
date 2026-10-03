import { asc } from "drizzle-orm";
import { db } from "@/db/client";
import { services } from "@/db/schema";
import { ServiceForm, ServiceRow } from "./ServiceForm";

export const dynamic = "force-dynamic";

export default async function ServicesAdminPage() {
  const rows = await db.select().from(services).orderBy(asc(services.sortOrder));

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl uppercase">Үйлчилгээ</h1>
      <div className="mb-8 border border-line-strong bg-bg-0">
        {rows.map((s) => (
          <ServiceRow key={s.id} service={s} />
        ))}
        {rows.length === 0 && <p className="px-5 py-6 text-center text-muted">Үйлчилгээ алга.</p>}
      </div>
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">Шинэ үйлчилгээ нэмэх</h2>
      <ServiceForm />
    </div>
  );
}
