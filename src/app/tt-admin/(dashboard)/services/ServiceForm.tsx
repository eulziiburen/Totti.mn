"use client";

import { useState } from "react";
import { upsertService, deleteService } from "./actions";

const inputClass =
  "w-full border-0 border-b-2 border-line-strong bg-transparent py-2 text-sm text-chalk outline-none focus:border-amber";
const labelClass = "text-[11px] font-bold uppercase tracking-wide text-muted";

type Service = {
  id: number;
  idx: string;
  title: string;
  titleEn: string | null;
  description: string;
  descriptionEn: string | null;
  iconPath: string;
  sortOrder: number;
};

export function ServiceForm({ service, onDone }: { service?: Service; onDone?: () => void }) {
  return (
    <form
      action={async (formData) => {
        await upsertService(formData);
        onDone?.();
      }}
      className="grid grid-cols-2 gap-4 border border-line-strong bg-bg-0 p-5 sm:grid-cols-4"
    >
      {service && <input type="hidden" name="id" value={service.id} />}
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Дугаар</label>
        <input name="idx" defaultValue={service?.idx} placeholder="01" required className={inputClass} />
      </div>
      <div className="flex flex-col gap-1 sm:col-span-2">
        <label className={labelClass}>Гарчиг</label>
        <input name="title" defaultValue={service?.title} required className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Эрэмбэ</label>
        <input name="sortOrder" defaultValue={String(service?.sortOrder ?? 0)} className={inputClass} />
      </div>
      <div className="col-span-2 flex flex-col gap-1 sm:col-span-3">
        <label className={labelClass}>Тайлбар</label>
        <textarea name="description" defaultValue={service?.description} required rows={2} className={inputClass} />
      </div>
      <div className="col-span-2 flex flex-col gap-1 sm:col-span-2">
        <label className={labelClass}>Гарчиг (English)</label>
        <input name="titleEn" defaultValue={service?.titleEn ?? ""} className={inputClass} />
      </div>
      <div className="col-span-2 flex flex-col gap-1 sm:col-span-2">
        <label className={labelClass}>Тайлбар (English)</label>
        <textarea name="descriptionEn" defaultValue={service?.descriptionEn ?? ""} rows={2} className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Icon SVG path (d=)</label>
        <input name="iconPath" defaultValue={service?.iconPath} className={inputClass} />
      </div>
      <div className="col-span-2 flex items-center gap-3 sm:col-span-4">
        <button type="submit" className="bg-amber px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-ink">
          Хадгалах
        </button>
        {onDone && (
          <button type="button" onClick={onDone} className="text-xs font-semibold text-muted underline">
            Цуцлах
          </button>
        )}
        {service && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Энэ үйлчилгээг устгах уу?")) deleteService(service.id);
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

export function ServiceRow({ service }: { service: Service }) {
  const [editing, setEditing] = useState(false);
  if (editing) return <ServiceForm service={service} onDone={() => setEditing(false)} />;

  return (
    <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3 last:border-b-0">
      <div>
        <span className="font-mono text-xs text-amber-dim">{service.idx}</span>{" "}
        <span className="font-semibold">{service.title}</span>
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
