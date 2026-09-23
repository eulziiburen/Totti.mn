import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/shop/ProductCard";
import { getProducts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Онлайн дэлгүүр | ТОТТИ Спортын агент",
};

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const products = await getProducts(q);

  return (
    <>
      <Header />
      <main className="pb-[110px] pt-[150px]">
        <div className="mx-auto max-w-[1180px] px-8">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-amber">Дэлгүүр</p>
          <h1 className="mt-3.5 font-display text-[clamp(32px,4.5vw,54px)] uppercase leading-[0.92]">
            ОНЛАЙН ДЭЛГҮҮР
          </h1>
          <p className="mt-4.5 max-w-[640px] text-base leading-relaxed text-muted">
            ТОТТИ-гийн албан ёсны хэрэглэл, дагалдах бараа.
          </p>
          {q && (
            <p className="mt-5 text-sm text-muted">
              &ldquo;{q}&rdquo; хайлтын илэрц ({products.length})
            </p>
          )}

          {products.length === 0 ? (
            <p className="mt-16 rounded-2xl border border-dashed border-line-strong px-6 py-16 text-center text-muted">
              {q ? "Илэрц олдсонгүй." : "Одоогоор бараа алга."}
            </p>
          ) : (
            <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
