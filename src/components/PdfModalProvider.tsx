"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { PdfDocuments, PdfKey } from "@/lib/data";

type PdfModalContextValue = {
  openKey: PdfKey | null;
  open: (key: PdfKey) => void;
  close: () => void;
};

const PdfModalContext = createContext<PdfModalContextValue | null>(null);

export function usePdfModal() {
  const ctx = useContext(PdfModalContext);
  if (!ctx) throw new Error("usePdfModal must be used within PdfModalProvider");
  return ctx;
}

export function PdfModalProvider({
  children,
  documents,
}: {
  children: ReactNode;
  documents: PdfDocuments;
}) {
  const [openKey, setOpenKey] = useState<PdfKey | null>(null);

  const open = useCallback((key: PdfKey) => {
    setOpenKey(key);
    history.replaceState(null, "", "#players-" + key);
  }, []);

  const close = useCallback(() => {
    setOpenKey(null);
    history.replaceState(null, "", location.pathname + location.search + "#roster");
  }, []);

  useEffect(() => {
    const m = location.hash.match(/^#players-(male|female)$/);
    if (m) setOpenKey(m[1] as PdfKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = openKey ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openKey]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <PdfModalContext.Provider value={{ openKey, open, close }}>
      {children}
      {openKey && (
        <PdfModal activeKey={openKey} documents={documents} onClose={close} onSelect={open} />
      )}
    </PdfModalContext.Provider>
  );
}

function PdfModal({
  activeKey,
  documents,
  onClose,
  onSelect,
}: {
  activeKey: PdfKey;
  documents: PdfDocuments;
  onClose: () => void;
  onSelect: (key: PdfKey) => void;
}) {
  const doc = documents[activeKey];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Тоглогчдын танилцуулга"
      className="fixed inset-0 z-[300] flex items-center justify-center bg-[rgba(13,12,10,0.72)] p-0 backdrop-blur-sm sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex h-full max-h-[92vh] w-full max-w-[1000px] flex-col overflow-hidden rounded-none border-t-[3px] border-amber bg-white shadow-[0_30px_80px_rgba(0,0,0,0.4)] sm:max-h-full sm:rounded-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-bg-1 px-4 py-3">
          <div className="flex gap-1.5">
            {(Object.keys(documents) as PdfKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => onSelect(key)}
                className={`rounded-full px-[18px] py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                  key === activeKey
                    ? "border border-amber bg-amber text-ink"
                    : "border border-line-strong text-chalk hover:border-chalk"
                }`}
              >
                {documents[key].label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <a
              href={doc.url}
              target="_blank"
              rel="noopener"
              className="rounded-full border border-line-strong px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-chalk transition-all hover:border-chalk hover:bg-chalk hover:text-bg-0"
            >
              Шинэ цонхонд нээх
            </a>
            <a
              href={doc.url}
              download
              className="rounded-full border border-line-strong px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-chalk transition-all hover:border-chalk hover:bg-chalk hover:text-bg-0"
            >
              Татах
            </a>
            <button
              type="button"
              aria-label="Хаах"
              onClick={onClose}
              className="rounded-full border border-line-strong px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-chalk transition-all hover:border-chalk hover:bg-chalk hover:text-bg-0"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 bg-bg-2">
          <iframe
            title="Тоглогчдын танилцуулга PDF"
            src={doc.url + "#view=FitH"}
            className="block h-full w-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
