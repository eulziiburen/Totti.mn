"use client";

import { useState } from "react";
import { upsertVariant, deleteVariant } from "./variant-actions";
import { SubmitButton } from "@/components/admin/SubmitButton";

const inputClass =
  "w-full border-0 border-b-2 border-line-strong bg-transparent py-2 text-sm text-chalk outline-none focus:border-amber";
const labelClass = "text-[11px] font-bold uppercase tracking-wide text-muted";

export type Variant = {
  id: number;
  productId: number;
  size: string | null;
  color: string | null;
  sku: string | null;
  priceOverride: number | null;
  stock: number;
  isActive: boolean;
  sortOrder: number;
};

function VariantRow({ variant }: { variant: Variant }) {
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={async (formData) => {
        setError(null);
        try {
          await upsertVariant(formData);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Алдаа гарлаа.");
        }
      }}
      className="grid grid-cols-2 items-end gap-3 border-b border-line px-5 py-4 last:border-b-0 sm:grid-cols-7"
    >
      <input type="hidden" name="id" value={variant.id} />
      <input type="hidden" name="productId" value={variant.productId} />
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Хэмжээ</label>
        <input name="size" defaultValue={variant.size ?? ""} placeholder="L" className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Өнгө</label>
        <input name="color" defaultValue={variant.color ?? ""} placeholder="Улаан" className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClass}>SKU</label>
        <input name="sku" defaultValue={variant.sku ?? ""} className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Үнэ (заавал биш)</label>
        <input
          name="priceOverride"
          type="number"
          min={0}
          defaultValue={variant.priceOverride ?? ""}
          placeholder="Үндсэн үнэ"
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Үлдэгдэл</label>
        <input name="stock" type="number" min={0} defaultValue={variant.stock} required className={inputClass} />
      </div>
      <div className="flex items-center gap-2 pb-2">
        <input
          id={`variant-active-${variant.id}`}
          type="checkbox"
          name="isActive"
          defaultChecked={variant.isActive}
          className="h-4 w-4"
        />
        <label htmlFor={`variant-active-${variant.id}`} className={labelClass}>
          Идэвхтэй
        </label>
      </div>
      <div className="flex items-center gap-2">
        <SubmitButton label="Хадгалах" pendingLabel="…" />
        <button
          type="button"
          onClick={() => {
            if (confirm("Энэ хувилбарыг устгах уу?")) {
              deleteVariant(variant.id, variant.productId).catch((err) =>
                setError(err instanceof Error ? err.message : "Алдаа гарлаа.")
              );
            }
          }}
          className="text-xs font-semibold text-red-600 underline"
        >
          Устгах
        </button>
      </div>
      {error && <p className="col-span-2 text-[13px] font-semibold text-red-600 sm:col-span-7">{error}</p>}
    </form>
  );
}

function NewVariantForm({ productId }: { productId: number }) {
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={async (formData) => {
        setError(null);
        try {
          await upsertVariant(formData);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Алдаа гарлаа.");
        }
      }}
      className="grid grid-cols-2 items-end gap-3 border border-line-strong bg-bg-0 p-5 sm:grid-cols-7"
    >
      <input type="hidden" name="productId" value={productId} />
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Хэмжээ</label>
        <input name="size" placeholder="L" className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Өнгө</label>
        <input name="color" placeholder="Улаан" className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClass}>SKU</label>
        <input name="sku" className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Үнэ (заавал биш)</label>
        <input name="priceOverride" type="number" min={0} placeholder="Үндсэн үнэ" className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Үлдэгдэл</label>
        <input name="stock" type="number" min={0} defaultValue={0} required className={inputClass} />
      </div>
      <div className="flex items-center gap-2 pb-2">
        <input id="new-variant-active" type="checkbox" name="isActive" defaultChecked className="h-4 w-4" />
        <label htmlFor="new-variant-active" className={labelClass}>
          Идэвхтэй
        </label>
      </div>
      <SubmitButton label="Нэмэх" pendingLabel="…" />
      {error && <p className="col-span-2 text-[13px] font-semibold text-red-600 sm:col-span-7">{error}</p>}
    </form>
  );
}

export function VariantsSection({ productId, variants }: { productId: number; variants: Variant[] }) {
  return (
    <div className="mt-8">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">
        Хувилбарууд (хэмжээ / өнгө / үлдэгдэл)
      </h2>
      <div className="mb-5 border border-line-strong bg-bg-0">
        {variants.map((v) => (
          <VariantRow key={v.id} variant={v} />
        ))}
        {variants.length === 0 && (
          <p className="px-5 py-6 text-center text-muted">
            Хувилбар алга. Худалдаанд гарахын тулд доор доод тал нь нэг хувилбар (жишээ нь стандарт хэмжээ) нэмнэ
            үү.
          </p>
        )}
      </div>
      <NewVariantForm productId={productId} />
    </div>
  );
}
