import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OrderStatusPoller } from "@/components/shop/OrderStatusPoller";
import { db } from "@/db/client";
import { orderItems, orders } from "@/db/schema";

export const metadata: Metadata = { title: "Захиалгын төлөв | ТОТТИ Дэлгүүр" };
export const dynamic = "force-dynamic";

function formatPrice(n: number) {
  return `${n.toLocaleString("mn-MN")}₮`;
}

export default async function OrderStatusPage({ params }: { params: Promise<{ orderNo: string }> }) {
  const { orderNo } = await params;
  const [order] = await db.select().from(orders).where(eq(orders.orderNo, orderNo));
  if (!order) notFound();

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));

  return (
    <>
      <Header />
      <main className="pb-[110px] pt-[150px]">
        <div className="mx-auto max-w-[640px] px-8">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-amber">Захиалга #{order.orderNo}</p>
          <h1 className="mt-3.5 font-display text-[clamp(26px,3vw,36px)] uppercase leading-[0.98]">
            ЗАХИАЛГЫН ТӨЛӨВ
          </h1>

          <div className="mt-8 rounded-3xl border border-line-strong bg-bg-0 p-6 sm:p-8">
            <OrderStatusPoller
              orderNo={order.orderNo}
              initialStatus={order.status}
              hasInvoice={!!order.qpayInvoiceId}
            />

            {order.status === "pending" && order.qpayInvoiceId && (
              <div className="mt-6 flex flex-col items-center gap-4">
                {order.qpayQrImage ? (
                  // eslint-disable-next-line @next/next/no-img-element -- base64 data: URI, not a
                  // remote image next/image's optimizer can process
                  <img
                    src={`data:image/png;base64,${order.qpayQrImage}`}
                    alt="QPay QR код"
                    className="h-56 w-56 rounded-2xl border border-line-strong"
                  />
                ) : order.qpayShortUrl ? (
                  <a
                    href={order.qpayShortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 rounded-full bg-amber px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-ink"
                  >
                    QPay-р төлөх →
                  </a>
                ) : (
                  <p className="text-[13px] text-muted">QR код бэлдэгдэж байна…</p>
                )}
                <p className="text-center text-[13px] text-muted">
                  QPay дэмждэг банкны аппликейшнээр QR кодыг уншуулан төлбөрөө төлнө үү.
                </p>
              </div>
            )}

            <div className="mt-8 border-t border-line pt-6">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">Захиалгын жагсаалт</h2>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item.id} className="flex items-baseline justify-between gap-3 text-sm">
                    <span>
                      {item.productName}
                      {item.variantLabel && item.variantLabel !== "—" ? ` (${item.variantLabel})` : ""} ×{" "}
                      {item.quantity}
                    </span>
                    <span className="flex-none font-semibold">{formatPrice(item.lineTotal)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
                <span className="text-sm font-bold uppercase tracking-wide text-muted">Нийт</span>
                <span className="font-display text-xl">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-[13px] text-muted">
            Асуулт байвал{" "}
            <a href="tel:+97688602941" className="font-semibold underline">
              +976 88602941
            </a>{" "}
            дугаарт холбогдоно уу.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
