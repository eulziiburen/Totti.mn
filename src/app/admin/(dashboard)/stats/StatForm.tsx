"use client";

import { useState } from "react";
import { upsertStat, deleteStat } from "./actions";
import { SubmitButton } from "@/components/admin/SubmitButton";

const inputClass =
  "w-full border-0 border-b-2 border-line-strong bg-transparent py-2 text-sm text-chalk outline-none focus:border-amber";
const labelClass = "text-[11px] font-bold uppercase tracking-wide text-muted";

type Stat = { id: number; value: number; label: string; labelEn: string | null; sortOrder: number };

export function StatForm({ stat, onDone }: { stat?: Stat; onDone?: () => void }) {
  return (
    <form
      action={async (formData) => {
        await upsertStat(formData);
        onDone?.();
      }}
      className="grid grid-cols-2 gap-4 border border-line-strong bg-bg-0 p-5 sm:grid-cols-4"
    >
      {stat && <input type="hidden" name="id" value={stat.id} />}
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Тоо</label>
        <input name="value" type="number" defaultValue={stat?.value} placeholder="34" required className={inputClass} />
      </div>
      <div className="flex flex-col gap-1 sm:col-span-2">
        <label className={labelClass}>Тайлбар</label>
        <input
          name="label"
          defaultValue={stat?.label}
          placeholder="Төлөөлж буй тамирчин"
          required
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-1 sm:col-span-2">
        <label className={labelClass}>Тайлбар (English)</label>
        <input name="labelEn" defaultValue={stat?.labelEn ?? ""} placeholder="Players represented" className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Эрэмбэ</label>
        <input name="sortOrder" defaultValue={String(stat?.sortOrder ?? 0)} className={inputClass} />
      </div>
      <div className="col-span-2 flex items-center gap-3 sm:col-span-4">
        <SubmitButton />
        {onDone && (
          <button type="button" onClick={onDone} className="text-xs font-semibold text-muted underline">
            Цуцлах
          </button>
        )}
        {stat && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Энэ тоон үзүүлэлтийг устгах уу?")) deleteStat(stat.id);
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

export function StatRow({ stat }: { stat: Stat }) {
  const [editing, setEditing] = useState(false);
  if (editing) return <StatForm stat={stat} onDone={() => setEditing(false)} />;

  return (
    <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3 last:border-b-0">
      <div>
        <span className="font-mono font-semibold text-amber">{stat.value}</span>{" "}
        <span className="text-sm">{stat.label}</span>
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
