"use client";

import { useState } from "react";
import { upsertPlayer, deletePlayer } from "./actions";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { parseLinks } from "@/lib/links";
import { LinksField } from "./LinksField";

type Stat = { label: string; value: string };

type Player = {
  id: number;
  slug: string;
  ghost: string;
  pos: string;
  jersey: string | null;
  name: string;
  team: string;
  photoUrl: string | null;
  statsJson: string;
  height: string | null;
  bio: string | null;
  bioEn: string | null;
  videoUrl: string | null;
  linksJson: string;
  sortOrder: number;
};

const inputClass =
  "w-full border-0 border-b-2 border-line-strong bg-transparent py-2 text-sm text-chalk outline-none focus:border-amber";
const labelClass = "text-[11px] font-bold uppercase tracking-wide text-muted";

function Field({ label, name, defaultValue, placeholder, required }: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className={labelClass}>{label}</label>
      <input name={name} defaultValue={defaultValue} placeholder={placeholder} required={required} className={inputClass} />
    </div>
  );
}

export function PlayerForm({ player, onDone }: { player?: Player; onDone?: () => void }) {
  const stats: Stat[] = player ? JSON.parse(player.statsJson || "[]") : [];

  return (
    <form
      action={async (formData) => {
        await upsertPlayer(formData);
        onDone?.();
      }}
      className="grid grid-cols-2 gap-4 border border-line-strong bg-bg-0 p-5 sm:grid-cols-3"
    >
      {player && <input type="hidden" name="id" value={player.id} />}
      <Field label="Slug (хаягт орно, зайгүй)" name="slug" defaultValue={player?.slug} placeholder="crawford-gregory" required />
      <Field label="Нэр" name="name" defaultValue={player?.name} placeholder="Б. Ганбаатар" required />
      <Field label="Клуб" name="team" defaultValue={player?.team} placeholder='"Улаанбаатар Тахь" клуб' />
      <Field label="Байрлал (богино)" name="pos" defaultValue={player?.pos} placeholder="POINT GUARD" />
      <Field label="Ghost (PG/SG/C)" name="ghost" defaultValue={player?.ghost} placeholder="PG" />
      <Field label="Дугаар" name="jersey" defaultValue={player?.jersey ?? ""} placeholder="#23" />
      <ImageUploadField
        label="Зураг"
        fileName="photoFile"
        currentUrlFieldName="currentPhotoUrl"
        currentUrl={player?.photoUrl ?? null}
      />
      <Field label="Эрэмбэ" name="sortOrder" defaultValue={String(player?.sortOrder ?? 0)} />
      <Field label="Өндөр" name="height" defaultValue={player?.height ?? ""} placeholder="1.93 м" />
      <div className="col-span-2">
        <Field
          label="Видео хайлайт (YouTube холбоос)"
          name="videoUrl"
          defaultValue={player?.videoUrl ?? ""}
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </div>
      <div className="col-span-2 flex flex-col gap-1 sm:col-span-3">
        <label className={labelClass}>Намтар</label>
        <textarea
          name="bio"
          defaultValue={player?.bio ?? ""}
          rows={4}
          placeholder="Тамирчны карьер, амжилт, тоглох хэв маяг…"
          className={inputClass}
        />
      </div>
      <div className="col-span-2 flex flex-col gap-1 sm:col-span-3">
        <label className={labelClass}>Намтар (English)</label>
        <textarea
          name="bioEn"
          defaultValue={player?.bioEn ?? ""}
          rows={4}
          placeholder="Career, achievements, playing style…"
          className={inputClass}
        />
      </div>

      <div className="col-span-2 grid grid-cols-3 gap-3 sm:col-span-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="grid grid-cols-2 gap-2">
            <Field label={`Stat ${i + 1} нэр`} name={`statLabel${i + 1}`} defaultValue={stats[i]?.label ?? ""} placeholder="PPG" />
            <Field label={`Stat ${i + 1} утга`} name={`statValue${i + 1}`} defaultValue={stats[i]?.value ?? ""} placeholder="18.4" />
          </div>
        ))}
      </div>

      <LinksField initial={parseLinks(player?.linksJson)} />

      <div className="col-span-2 flex items-center gap-3 sm:col-span-3">
        <SubmitButton />
        {onDone && (
          <button type="button" onClick={onDone} className="text-xs font-semibold text-muted underline">
            Цуцлах
          </button>
        )}
        {player && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Энэ тамирчныг устгах уу?")) deletePlayer(player.id);
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

export function PlayerRow({ player }: { player: Player }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return <PlayerForm player={player} onDone={() => setEditing(false)} />;
  }

  return (
    <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3 last:border-b-0">
      <div>
        <span className="font-semibold">{player.name}</span>{" "}
        <span className="text-sm text-muted">
          · {player.pos} · {player.team}
        </span>
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
