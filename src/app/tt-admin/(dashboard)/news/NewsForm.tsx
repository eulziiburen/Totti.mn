"use client";

import { useState } from "react";
import { upsertNews, deleteNews } from "./actions";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { SubmitButton } from "@/components/admin/SubmitButton";

const inputClass =
  "w-full border-0 border-b-2 border-line-strong bg-transparent py-2 text-sm text-chalk outline-none focus:border-amber";
const labelClass = "text-[11px] font-bold uppercase tracking-wide text-muted";

type News = {
  id: number;
  slug: string;
  title: string;
  titleEn: string | null;
  summary: string | null;
  summaryEn: string | null;
  body: string;
  bodyEn: string | null;
  imageUrl: string | null;
  publishedAt: string;
  isPublished: boolean;
};

export function NewsForm({ item, onDone }: { item?: News; onDone?: () => void }) {
  return (
    <form
      action={async (formData) => {
        await upsertNews(formData);
        onDone?.();
      }}
      className="grid grid-cols-2 gap-4 border border-line-strong bg-bg-0 p-5 sm:grid-cols-4"
    >
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="col-span-2 flex flex-col gap-1">
        <label className={labelClass}>Гарчиг</label>
        <input name="title" defaultValue={item?.title} required className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Slug (URL)</label>
        <input name="slug" defaultValue={item?.slug} placeholder="shine-geree-2026" required className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Огноо</label>
        <input
          type="date"
          name="publishedAt"
          defaultValue={item?.publishedAt ?? new Date().toISOString().slice(0, 10)}
          required
          className={inputClass}
        />
      </div>
      <div className="col-span-2 flex flex-col gap-1 sm:col-span-4">
        <label className={labelClass}>Товч агуулга</label>
        <textarea name="summary" defaultValue={item?.summary ?? ""} rows={2} className={inputClass} />
      </div>
      <div className="col-span-2 flex flex-col gap-1 sm:col-span-4">
        <label className={labelClass}>Агуулга</label>
        <textarea name="body" defaultValue={item?.body} required rows={8} className={inputClass} />
      </div>
      <div className="col-span-2 flex flex-col gap-1">
        <label className={labelClass}>Гарчиг (English)</label>
        <input name="titleEn" defaultValue={item?.titleEn ?? ""} className={inputClass} />
      </div>
      <div className="col-span-2 flex flex-col gap-1">
        <label className={labelClass}>Товч агуулга (English)</label>
        <textarea name="summaryEn" defaultValue={item?.summaryEn ?? ""} rows={2} className={inputClass} />
      </div>
      <div className="col-span-2 flex flex-col gap-1 sm:col-span-4">
        <label className={labelClass}>Агуулга (English)</label>
        <textarea name="bodyEn" defaultValue={item?.bodyEn ?? ""} rows={6} className={inputClass} />
      </div>
      <div className="col-span-2 flex flex-col gap-1">
        <ImageUploadField
          label="Зураг"
          fileName="imageFile"
          currentUrlFieldName="currentImageUrl"
          currentUrl={item?.imageUrl ?? null}
        />
      </div>
      <label className="col-span-2 flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" name="isPublished" defaultChecked={item?.isPublished ?? true} className="accent-amber" />
        Сайтад нийтлэх
      </label>
      <div className="col-span-2 flex items-center gap-3 sm:col-span-4">
        <SubmitButton />
        {onDone && (
          <button type="button" onClick={onDone} className="text-xs font-semibold text-muted underline">
            Цуцлах
          </button>
        )}
        {item && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Энэ мэдээг устгах уу?")) deleteNews(item.id);
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

export function NewsRow({ item }: { item: News }) {
  const [editing, setEditing] = useState(false);
  if (editing) return <NewsForm item={item} onDone={() => setEditing(false)} />;

  return (
    <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3 last:border-b-0">
      <div className="min-w-0">
        <span className="font-mono text-xs text-amber-dim">{item.publishedAt}</span>{" "}
        <span className="font-semibold">{item.title}</span>
        {!item.isPublished && (
          <span className="ml-2 border border-line-strong px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted">
            Ноорог
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="border border-line-strong px-3 py-1.5 text-xs font-semibold uppercase tracking-wide hover:border-chalk"
      >
        Засах
      </button>
    </div>
  );
}
