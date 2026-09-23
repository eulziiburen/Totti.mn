"use client";

import { useState } from "react";
import Link from "next/link";
import { upsertProduct, deleteProduct } from "./actions";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { SubmitButton } from "@/components/admin/SubmitButton";

const inputClass =
  "w-full border-0 border-b-2 border-line-strong bg-transparent py-2 text-sm text-chalk outline-none focus:border-amber";
const labelClass = "text-[11px] font-bold uppercase tracking-wide text-muted";

export type Product = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  basePrice: number;
  isActive: boolean;
  sortOrder: number;
};

export function ProductForm({ product, onDone }: { product?: Product; onDone?: () => void }) {
  return (
    <form
      action={async (formData) => {
        await upsertProduct(formData);
        onDone?.();
      }}
      className="grid grid-cols-2 gap-4 border border-line-strong bg-bg-0 p-5 sm:grid-cols-3"
    >
      {product && <input type="hidden" name="id" value={product.id} />}
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Slug</label>
        <input name="slug" defaultValue={product?.slug} placeholder="jersey-home" required className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Нэр</label>
        <input name="name" defaultValue={product?.name} placeholder="Гэрийн джерси" required className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Үнэ (₮)</label>
        <input
          name="basePrice"
          type="number"
          min={0}
          defaultValue={product?.basePrice}
          placeholder="45000"
          required
          className={inputClass}
        />
      </div>
      <div className="col-span-2 flex flex-col gap-1 sm:col-span-3">
        <label className={labelClass}>Тайлбар</label>
        <textarea
          name="description"
          defaultValue={product?.description ?? ""}
          rows={2}
          className={`${inputClass} resize-none`}
        />
      </div>
      <ImageUploadField
        label="Зураг"
        fileName="imageFile"
        currentUrlFieldName="currentImageUrl"
        currentUrl={product?.imageUrl ?? null}
      />
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Эрэмбэ</label>
        <input name="sortOrder" defaultValue={String(product?.sortOrder ?? 0)} className={inputClass} />
      </div>
      <div className="flex items-center gap-2 pt-5">
        <input
          id={`isActive-${product?.id ?? "new"}`}
          type="checkbox"
          name="isActive"
          defaultChecked={product?.isActive ?? true}
          className="h-4 w-4"
        />
        <label htmlFor={`isActive-${product?.id ?? "new"}`} className={labelClass}>
          Идэвхтэй
        </label>
      </div>

      <div className="col-span-2 flex items-center gap-3 sm:col-span-3">
        <SubmitButton />
        {onDone && (
          <button type="button" onClick={onDone} className="text-xs font-semibold text-muted underline">
            Цуцлах
          </button>
        )}
        {product && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Энэ бараа устгах уу?")) deleteProduct(product.id);
            }}
            className="ml-auto text-xs font-semibold text-red-600 underline"
          >
            Устгах
          </button>
        )}
      </div>
    </form>
  );
}

export function ProductRow({ product }: { product: Product }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return <ProductForm product={product} onDone={() => setEditing(false)} />;
  }

  return (
    <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3 last:border-b-0">
      <div>
        <span className="font-semibold">{product.name}</span>{" "}
        <span className="text-sm text-muted">
          · {product.basePrice.toLocaleString("mn-MN")}₮ {!product.isActive && "· идэвхгүй"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={`/admin/products/${product.id}`}
          className="border border-line-strong px-3 py-1.5 text-xs font-semibold uppercase tracking-wide hover:border-chalk"
        >
          Хувилбар
        </Link>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="border border-line-strong px-3 py-1.5 text-xs font-semibold uppercase tracking-wide hover:border-chalk"
        >
          Засах
        </button>
      </div>
    </div>
  );
}
