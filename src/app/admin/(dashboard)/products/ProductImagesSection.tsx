"use client";

import Image from "next/image";
import { useState } from "react";
import { addProductImage, deleteProductImage } from "./image-actions";
import { SubmitButton } from "@/components/admin/SubmitButton";

export type ProductImage = { id: number; url: string };

export function ProductImagesSection({ productId, images }: { productId: number; images: ProductImage[] }) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mt-8">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">
        Нэмэлт зургууд (гол зургаас гадна)
      </h2>
      {images.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative h-20 w-20 overflow-hidden border border-line-strong bg-bg-1">
              <Image src={img.url} alt="" fill sizes="80px" className="object-cover" unoptimized />
              <button
                type="button"
                onClick={() => {
                  if (confirm("Энэ зургийг устгах уу?")) deleteProductImage(img.id, productId);
                }}
                className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center bg-ink/80 text-xs text-white"
                aria-label="Устгах"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      <form
        action={async (formData) => {
          setError(null);
          try {
            await addProductImage(formData);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Алдаа гарлаа.");
          }
        }}
        className="flex items-center gap-3 border border-line-strong bg-bg-0 p-4"
      >
        <input type="hidden" name="productId" value={productId} />
        <input
          type="file"
          name="imageFile"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          className="flex-1 text-xs text-muted file:mr-3 file:border file:border-line-strong file:bg-bg-0 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-wide"
        />
        <SubmitButton label="Нэмэх" pendingLabel="…" />
      </form>
      {error && <p className="mt-2 text-[13px] font-semibold text-red-600">{error}</p>}
    </div>
  );
}
