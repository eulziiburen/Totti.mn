"use client";

import { useState } from "react";
import { uploadPlayerDocument } from "./pdf-actions";
import { SubmitButton } from "@/components/admin/SubmitButton";
import type { PdfDocuments, PdfKey } from "@/lib/data";

function DocUploadRow({ docKey, doc }: { docKey: PdfKey; doc: PdfDocuments[PdfKey] }) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      action={async (formData) => {
        setError(null);
        try {
          await uploadPlayerDocument(docKey, formData);
          setFileName(null);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Алдаа гарлаа.");
        }
      }}
      className="flex flex-wrap items-center gap-4 border-b border-line px-5 py-4 last:border-b-0"
    >
      <div className="min-w-[90px]">
        <span className="text-xs font-bold uppercase tracking-wide text-muted">{doc.label}</span>
      </div>
      <a
        href={doc.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm underline decoration-line-strong underline-offset-2 hover:decoration-chalk"
      >
        {doc.name}
      </a>
      <input
        type="file"
        name="file"
        accept="application/pdf"
        onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        className="flex-1 text-xs text-muted file:mr-3 file:border file:border-line-strong file:bg-bg-0 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-wide"
      />
      <SubmitButton label="Солих" pendingLabel="Илгээж байна…" />
      {error && <p className="w-full text-[13px] font-semibold text-red-600">{error}</p>}
      {fileName && !error && (
        <p className="w-full text-[13px] text-muted">Сонгосон: {fileName}</p>
      )}
    </form>
  );
}

export function PlayerDocumentsSection({ documents }: { documents: PdfDocuments }) {
  return (
    <div className="mb-8">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted">
        Тамирчдын танилцуулга PDF
      </h2>
      <div className="border border-line-strong bg-bg-0">
        <DocUploadRow docKey="male" doc={documents.male} />
        <DocUploadRow docKey="female" doc={documents.female} />
      </div>
    </div>
  );
}
