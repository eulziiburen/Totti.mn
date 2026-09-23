import { desc } from "drizzle-orm";
import { db } from "@/db/client";
import { orderItems, orders } from "@/db/schema";
import { OrderRow } from "./OrderRow";

export const dynamic = "force-dynamic";

export default async function OrdersAdminPage() {
  const [orderRows, itemRows] = await Promise.all([
    db.select().from(orders).orderBy(desc(orders.createdAt)),
    db.select().from(orderItems),
  ]);

  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="font-display text-2xl uppercase">Захиалгууд</h1>
        <span className="text-sm text-muted">{orderRows.length} захиалга</span>
      </div>
      {orderRows.length === 0 ? (
        <p className="border border-dashed border-line-strong px-6 py-10 text-center text-muted">
          Одоогоор захиалга алга.
        </p>
      ) : (
        <div className="border border-line-strong bg-bg-0">
          {orderRows.map((o) => (
            <OrderRow key={o.id} order={o} items={itemRows.filter((i) => i.orderId === o.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
