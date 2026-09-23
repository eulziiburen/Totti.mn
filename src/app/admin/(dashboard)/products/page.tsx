import { asc } from "drizzle-orm";
import { db } from "@/db/client";
import { products } from "@/db/schema";
import { ProductForm, ProductRow } from "./ProductForm";

export const dynamic = "force-dynamic";

export default async function ProductsAdminPage() {
  const rows = await db.select().from(products).orderBy(asc(products.sortOrder));

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl uppercase">Дэлгүүр</h1>

      <div className="mb-8 border border-line-strong bg-bg-0">
        {rows.map((p) => (
          <ProductRow key={p.id} product={p} />
        ))}
        {rows.length === 0 && <p className="px-5 py-6 text-center text-muted">Бараа алга.</p>}
      </div>

      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">Шинэ бараа нэмэх</h2>
      <ProductForm />
    </div>
  );
}
