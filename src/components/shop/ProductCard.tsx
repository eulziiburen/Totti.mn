import Image from "next/image";
import type { ProductSummary } from "@/lib/content";

function formatPrice(n: number) {
  return `${n.toLocaleString("mn-MN")}₮`;
}

export function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <a
      href={`/delguur/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-bg-0 transition-all hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)]"
    >
      <div className="relative aspect-square w-full bg-bg-1">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 280px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">Зураггүй</div>
        )}
        {!product.inStock && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            Дууссан
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-semibold leading-snug">{product.name}</h3>
        <p className="mt-auto text-lg font-bold text-amber-dim">
          {product.minPrice < product.basePrice ? "Эхлэх үнэ " : ""}
          {formatPrice(product.minPrice)}
        </p>
      </div>
    </a>
  );
}
