"use client";

import { useState } from "react";
import { upsertPartner, deletePartner } from "./actions";

const inputClass =
  "w-full border-0 border-b-2 border-line-strong bg-transparent py-2 text-sm text-chalk outline-none focus:border-amber";
const labelClass = "text-[11px] font-bold uppercase tracking-wide text-muted";

type Partner = { id: number; name: string; logoUrl: string; sortOrder: number };

export function PartnerForm({ partner, onDone }: { partner?: Partner; onDone?: () => void }) {
  return (
    <form
      action={async (formData) => {
        await upsertPartner(formData);
        onDone?.();
      }}
      className="grid grid-cols-2 gap-4 border border-line-strong bg-bg-0 p-5 sm:grid-cols-4"
    >
      {partner && <input type="hidden" name="id" value={partner.id} />}
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Нэр</label>
        <input name="name" defaultValue={partner?.name} required className={inputClass} />
      </div>
      <div className="flex flex-col gap-1 sm:col-span-2">
        <label className={labelClass}>Лого URL</label>
        <input
          name="logoUrl"
          defaultValue={partner?.logoUrl}
          placeholder="/images/partner-x.png"
          required
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Эрэмбэ</label>
        <input name="sortOrder" defaultValue={String(partner?.sortOrder ?? 0)} className={inputClass} />
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
        {partner && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Энэ түншийг устгах уу?")) deletePartner(partner.id);
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

export function PartnerRow({ partner }: { partner: Partner }) {
  const [editing, setEditing] = useState(false);
  if (editing) return <PartnerForm partner={partner} onDone={() => setEditing(false)} />;

  return (
    <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3 last:border-b-0">
      <span className="font-semibold">{partner.name}</span>
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
