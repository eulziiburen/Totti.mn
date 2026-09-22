"use client";

import type { AnchorHTMLAttributes } from "react";
import { usePdfModal } from "@/components/PdfModalProvider";
import type { PdfKey } from "@/lib/data";

export function PdfTriggerLink({
  pdfKey,
  className,
  children,
  ...rest
}: {
  pdfKey: PdfKey;
  children: React.ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { open } = usePdfModal();

  return (
    <a
      href={`#players-${pdfKey}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        open(pdfKey);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
