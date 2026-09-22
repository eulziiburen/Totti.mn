"use client";

import Image from "next/image";
import { useState } from "react";

const labelClass = "text-[11px] font-bold uppercase tracking-wide text-muted";

export function ImageUploadField({
  label,
  fileName,
  currentUrlFieldName,
  currentUrl,
}: {
  label: string;
  fileName: string;
  currentUrlFieldName: string;
  currentUrl: string | null;
}) {
  const [preview, setPreview] = useState<string | null>(currentUrl);

  return (
    <div className="flex flex-col gap-1">
      <label className={labelClass}>{label}</label>
      <input type="hidden" name={currentUrlFieldName} value={currentUrl ?? ""} />
      <div className="flex items-center gap-3">
        {preview ? (
          <div className="relative h-14 w-14 flex-none overflow-hidden border border-line-strong bg-bg-1">
            <Image src={preview} alt="" fill sizes="56px" className="object-cover" unoptimized />
          </div>
        ) : (
          <div className="flex h-14 w-14 flex-none items-center justify-center border border-dashed border-line-strong text-[10px] text-muted">
            Зураггүй
          </div>
        )}
        <input
          type="file"
          name={fileName}
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setPreview(URL.createObjectURL(file));
          }}
          className="flex-1 text-xs text-muted file:mr-3 file:border file:border-line-strong file:bg-bg-0 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-wide"
        />
      </div>
    </div>
  );
}
