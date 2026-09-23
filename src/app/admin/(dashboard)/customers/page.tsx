import { desc } from "drizzle-orm";
import { db } from "@/db/client";
import { customers, orders } from "@/db/schema";
import { CustomerRow } from "./CustomerRow";

export const dynamic = "force-dynamic";

export default async function CustomersAdminPage() {
  const [rows, orderRows] = await Promise.all([
    db.select().from(customers).orderBy(desc(customers.createdAt)),
    db.select().from(orders),
  ]);

  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="font-display text-2xl uppercase">Хэрэглэгчид</h1>
        <span className="text-sm text-muted">{rows.length} бүртгэл</span>
      </div>
      {rows.length === 0 ? (
        <p className="border border-dashed border-line-strong px-6 py-10 text-center text-muted">
          Одоогоор бүртгэлтэй хэрэглэгч алга.
        </p>
      ) : (
        <div className="border border-line-strong bg-bg-0">
          {rows.map((c) => (
            <CustomerRow
              key={c.id}
              customer={c}
              orderCount={orderRows.filter((o) => o.customerId === c.id).length}
            />
          ))}
        </div>
      )}
    </div>
  );
}
