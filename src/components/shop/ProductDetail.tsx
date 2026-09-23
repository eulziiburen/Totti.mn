"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { ProductDetail as ProductDetailType } from "@/lib/content";
import { useCart } from "@/components/CartProvider";

function formatPrice(n: number) {
  return `${n.toLocaleString("mn-MN")}₮`;
}

export function ProductDetail({ product }: { product: ProductDetailType }) {
  const { addItem, openDrawer } = useCart();
  const hasVariants = product.variants.length > 0;
  const sizes = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.size).filter((s): s is string => !!s))),
    [product.variants]
  );
  const colors = useMemo(
    () => Array.from(new Set(product.variants.map((v) => v.color).filter((c): c is string => !!c))),
    [product.variants]
  );

  const [size, setSize] = useState<string | null>(sizes[0] ?? null);
  const [color, setColor] = useState<string | null>(colors[0] ?? null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(product.images[0] ?? null);

  const selectedVariant = useMemo(() => {
    if (!hasVariants) return null;
    return (
      product.variants.find(
        (v) => (sizes.length === 0 || v.size === size) && (colors.length === 0 || v.color === color)
      ) ?? null
    );
  }, [hasVariants, product.variants, size, color, sizes.length, colors.length]);

  const stock = selectedVariant?.stock ?? 0;
  const price = selectedVariant?.price ?? product.basePrice;
  // Every purchasable product needs at least one productVariants row (even a single
  // default one with no size/color) — orderItems.variantId is a required FK, so a
  // product with zero variants simply can't be added to cart.
  const canAdd = !!selectedVariant && stock > 0;

  function handleAdd() {
    if (!canAdd || !selectedVariant) return;
    const variantLabel = [size, color].filter(Boolean).join(" / ") || "—";
    addItem(
      {
        variantId: selectedVariant.id,
        productId: product.id,
        slug: product.slug,
        productName: product.name,
        variantLabel,
        unitPrice: price,
        imageUrl: product.imageUrl,
        stockAtAdd: stock,
      },
      quantity
    );
    setAdded(true);
    setQuantity(1);
    openDrawer();
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      <div>
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-bg-1">
          {activeImage ? (
            <Image
              src={activeImage}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 560px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted">Зураггүй</div>
          )}
        </div>
        {product.images.length > 1 && (
          <div className="mt-3 flex flex-wrap gap-2.5">
            {product.images.map((img) => (
              <button
                key={img}
                type="button"
                onClick={() => setActiveImage(img)}
                className={`relative h-16 w-16 flex-none overflow-hidden rounded-xl border-2 transition-colors ${
                  activeImage === img ? "border-amber" : "border-transparent hover:border-line-strong"
                }`}
              >
                <Image src={img} alt="" fill sizes="64px" className="object-cover" unoptimized />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h1 className="font-display text-[clamp(28px,3.5vw,42px)] uppercase leading-[0.98]">{product.name}</h1>
        <p className="mt-3 text-2xl font-bold text-amber-dim">{formatPrice(price)}</p>
        {product.description && (
          <p className="mt-4 max-w-[520px] text-base leading-relaxed text-muted">{product.description}</p>
        )}

        {sizes.length > 0 && (
          <div className="mt-7">
            <p className="mb-2.5 text-[13px] font-bold uppercase tracking-wide text-muted">Хэмжээ</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                    size === s ? "border-amber bg-amber text-ink" : "border-line-strong hover:border-chalk"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {colors.length > 0 && (
          <div className="mt-5">
            <p className="mb-2.5 text-[13px] font-bold uppercase tracking-wide text-muted">Өнгө</p>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                    color === c ? "border-amber bg-amber text-ink" : "border-line-strong hover:border-chalk"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {hasVariants && !selectedVariant && (
          <p className="mt-4 text-[13px] font-semibold text-red-600">Энэ хослол одоогоор алга.</p>
        )}
        {hasVariants && selectedVariant && selectedVariant.stock === 0 && (
          <p className="mt-4 text-[13px] font-semibold text-red-600">Үлдэгдэл дууссан.</p>
        )}

        <div className="mt-7 flex flex-wrap items-center gap-4">
          <div className="flex items-center rounded-full border border-line-strong">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-11 w-11 items-center justify-center text-lg"
              aria-label="Хасах"
            >
              −
            </button>
            <span className="w-8 text-center font-semibold tabular-nums">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
              disabled={quantity >= stock}
              className="flex h-11 w-11 items-center justify-center text-lg disabled:opacity-30"
              aria-label="Нэмэх"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            className="inline-flex items-center gap-2.5 rounded-full bg-amber px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-ink transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(212,175,55,0.35)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {canAdd ? "Сагсанд нэмэх" : "Дууссан"}
          </button>
          {added && <span className="text-[13px] font-semibold text-amber-dim">Сагсанд нэмэгдлээ ✓</span>}
        </div>
      </div>
    </div>
  );
}
