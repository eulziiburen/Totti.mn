import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductDetail } from "@/components/shop/ProductDetail";
import { getProduct } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  return { title: product ? `${product.name} | ТОТТИ Дэлгүүр` : "Бараа олдсонгүй" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <>
      <Header />
      <main className="pb-[110px] pt-[150px]">
        <div className="mx-auto max-w-[1180px] px-8">
          <ProductDetail product={product} />
        </div>
      </main>
      <Footer />
    </>
  );
}
