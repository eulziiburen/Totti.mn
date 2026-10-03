"use client";

import { useState } from "react";

type Link = { label: string; url: string };

const inputClass =
  "w-full border-0 border-b-2 border-line-strong bg-transparent py-2 text-sm text-chalk outline-none focus:border-amber";
const labelClass = "text-[11px] font-bold uppercase tracking-wide text-muted";

export function LinksField({ initial }: { initial: Link[] }) {
  const [links, setLinks] = useState<Link[]>(initial.length > 0 ? initial : []);

  function update(i: number, patch: Partial<Link>) {
    setLinks((prev) => prev.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  }

  return (
    <div className="col-span-2 flex flex-col gap-2 sm:col-span-3">
      <label className={labelClass}>Холбоосууд (тамирчны хуудасны доод хэсэгт харагдана)</label>
      <input type="hidden" name="linksJson" value={JSON.stringify(links.filter((l) => l.url.trim()))} />

      {links.map((link, i) => (
        <div key={i} className="grid grid-cols-[1fr_2fr_auto] items-end gap-3">
          <input
            aria-label="Холбоосын нэр"
            value={link.label}
            onChange={(e) => update(i, { label: e.target.value })}
            placeholder="EuroBasket профайл"
            className={inputClass}
          />
          <input
            aria-label="Холбоосын хаяг"
            value={link.url}
            onChange={(e) => update(i, { url: e.target.value })}
            placeholder="https://basketball.eurobasket.com/player/…"
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => setLinks((prev) => prev.filter((_, j) => j !== i))}
            className="pb-2 text-xs font-semibold text-red-600 underline"
          >
            Хасах
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setLinks((prev) => [...prev, { label: "", url: "" }])}
        className="mt-1 w-fit border border-line-strong px-3 py-1.5 text-xs font-semibold uppercase tracking-wide hover:border-chalk"
      >
        + Холбоос нэмэх
      </button>
    </div>
  );
}
