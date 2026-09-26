import { desc } from "drizzle-orm";
import { db } from "@/db/client";
import { news } from "@/db/schema";
import { NewsForm, NewsRow } from "./NewsForm";

export const dynamic = "force-dynamic";

export default async function NewsAdminPage() {
  const rows = await db.select().from(news).orderBy(desc(news.publishedAt), desc(news.id));

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl uppercase">Мэдээ мэдээлэл</h1>
      <div className="mb-8 border border-line-strong bg-bg-0">
        {rows.map((n) => (
          <NewsRow key={n.id} item={n} />
        ))}
        {rows.length === 0 && <p className="px-5 py-6 text-center text-muted">Мэдээ алга.</p>}
      </div>
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">Шинэ мэдээ нэмэх</h2>
      <NewsForm />
    </div>
  );
}
