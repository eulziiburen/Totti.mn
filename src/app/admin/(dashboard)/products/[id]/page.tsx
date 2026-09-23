import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db/client";
import { productVariants, products } from "@/db/schema";
import { ProductForm } from "../ProductForm";
import { VariantsSection } from "../VariantsSection";

export const dynamic = "force-dynamic";

export default async function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = Number(id);
  const [product] = await db.select().from(products).where(eq(products.id, productId));
  if (!product) notFound();

  const variants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, productId))
    .orderBy(asc(productVariants.sortOrder));

  return (
    <div>
      <Link href="/admin/products" className="text-xs font-semibold uppercase tracking-wide text-muted hover:text-chalk">
        ← Дэлгүүр рүү буцах
      </Link>
      <h1 className="mb-6 mt-2 font-display text-2xl uppercase">{product.name}</h1>

      <ProductForm product={product} />
      <VariantsSection productId={productId} variants={variants} />
    </div>
  );
}
