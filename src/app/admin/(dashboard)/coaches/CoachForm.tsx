"use client";

import { useState } from "react";
import { upsertCoach, deleteCoach } from "./actions";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { parseLinks } from "@/lib/links";
import { LinksField } from "../roster/LinksField";

type CoachRow = {
  id: number;
  slug: string;
  name: string;
  role: string;
  roleEn: string | null;
  team: string;
  photoUrl: string | null;
  experience: string | null;
  license: string | null;
  achievements: string | null;
  achievementsEn: string | null;
  bio: string | null;
  bioEn: string | null;
  videoUrl: string | null;
  linksJson: string;
  sortOrder: number;
  isPublished: boolean;
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
      <label className={labelClass} htmlFor={`coach-${name}`}>
        {label}
      </label>
      <input id={`coach-${name}`} name={name} defaultValue={defaultValue} placeholder={placeholder} required={required} className={inputClass} />
    </div>
  );
}

function Area({ label, name, defaultValue, placeholder, rows = 4 }: { label: string; name: string; defaultValue?: string; placeholder?: string; rows?: number }) {
  return (
    <div className="col-span-2 flex flex-col gap-1 sm:col-span-3">
      <label className={labelClass} htmlFor={`coach-${name}`}>
        {label}
      </label>
      <textarea id={`coach-${name}`} name={name} defaultValue={defaultValue} rows={rows} placeholder={placeholder} className={inputClass} />
    </div>
  );
}

export function CoachForm({ coach, onDone }: { coach?: CoachRow; onDone?: () => void }) {
  return (
    <form
      action={async (formData) => {
        await upsertCoach(formData);
        onDone?.();
      }}
      className="grid grid-cols-2 gap-4 border border-line-strong bg-bg-0 p-5 sm:grid-cols-3"
    >
      {coach && <input type="hidden" name="id" value={coach.id} />}
      <Field label="Slug (хаягт орно, зайгүй)" name="slug" defaultValue={coach?.slug} placeholder="bat-erdene" required />
      <Field label="Нэр" name="name" defaultValue={coach?.name} placeholder="Б. Бат-Эрдэнэ" required />
      <Field label="Баг / клуб" name="team" defaultValue={coach?.team} placeholder='"Улаанбаатар Тахь" клуб' required />
      <Field label="Албан тушаал" name="role" defaultValue={coach?.role} placeholder="Ахлах дасгалжуулагч" required />
      <Field label="Албан тушаал (English)" name="roleEn" defaultValue={coach?.roleEn ?? ""} placeholder="Head coach" />
      <Field label="Туршлага" name="experience" defaultValue={coach?.experience ?? ""} placeholder="15 жил" />
      <Field label="Лиценз" name="license" defaultValue={coach?.license ?? ""} placeholder="FIBA Level 2" />
      <ImageUploadField label="Зураг" fileName="photoFile" currentUrlFieldName="currentPhotoUrl" currentUrl={coach?.photoUrl ?? null} />
      <Field label="Эрэмбэ" name="sortOrder" defaultValue={String(coach?.sortOrder ?? 0)} />
      <div className="col-span-2 sm:col-span-2">
        <Field label="Видео (YouTube холбоос)" name="videoUrl" defaultValue={coach?.videoUrl ?? ""} placeholder="https://www.youtube.com/watch?v=..." />
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" name="isPublished" defaultChecked={coach?.isPublished ?? true} className="h-4 w-4 accent-amber" /> Сайт дээр харуулах
      </label>

      <Area label="Амжилт (мөр бүрт нэг)" name="achievements" defaultValue={coach?.achievements ?? ""} placeholder={"2024 оны Үндэсний лигийн аварга\nШигшээ багийн туслах дасгалжуулагч (2019–2022)"} />
      <Area label="Амжилт (English, мөр бүрт нэг)" name="achievementsEn" defaultValue={coach?.achievementsEn ?? ""} placeholder={"2024 National League champion\nNational team assistant coach (2019–2022)"} />
      <Area label="Намтар" name="bio" defaultValue={coach?.bio ?? ""} placeholder="Дасгалжуулагчийн карьер, арга барил…" />
      <Area label="Намтар (English)" name="bioEn" defaultValue={coach?.bioEn ?? ""} placeholder="Career, coaching philosophy…" />

      <LinksField initial={parseLinks(coach?.linksJson)} />

      <div className="col-span-2 flex items-center gap-3 sm:col-span-3">
        <SubmitButton />
        {onDone && (
          <button type="button" onClick={onDone} className="text-xs font-semibold text-muted underline">
            Цуцлах
          </button>
        )}
        {coach && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Энэ дасгалжуулагчийг устгах уу?")) deleteCoach(coach.id);
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

export function CoachListRow({ coach }: { coach: CoachRow }) {
  const [editing, setEditing] = useState(false);

  if (editing) return <CoachForm coach={coach} onDone={() => setEditing(false)} />;

  return (
    <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3 last:border-b-0">
      <div>
        <span className="font-semibold">{coach.name}</span>{" "}
        <span className="text-sm text-muted">
          · {coach.role} · {coach.team}
        </span>
        {!coach.isPublished && <span className="ml-2 rounded bg-bg-1 px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted">Нуусан</span>}
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
