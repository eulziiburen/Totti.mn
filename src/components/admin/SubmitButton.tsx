"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ label = "Хадгалах", pendingLabel = "Хадгалж байна…" }: {
  label?: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 bg-amber px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-ink disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
