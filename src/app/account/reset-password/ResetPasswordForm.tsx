"use client";

import { useActionState } from "react";
import { resetPassword } from "../actions";

const initialState: { error?: string; done?: boolean } = {};

export function ResetPasswordForm({ token, email }: { token: string; email: string }) {
  const [state, formAction, pending] = useActionState(resetPassword, initialState);

  if (state.done) {
    return (
      <div className="mt-6">
        <p className="text-sm leading-relaxed text-muted">Нууц үг амжилттай солигдлоо.</p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- plain <a> avoids a Next.js
            client-navigation scroll-restoration bug (jumps to a random scroll offset on <Link>) */}
        <a
          href="/account/login"
          className="mt-4 inline-flex items-center justify-center gap-2.5 rounded-full bg-amber px-6 py-3.5 text-[13px] font-extrabold uppercase tracking-wider text-ink"
        >
          Нэвтрэх
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="email" value={email} />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-[13px] font-bold uppercase tracking-wide text-muted">
          Шинэ нууц үг
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          className="w-full border-0 border-b-2 border-line-strong bg-transparent py-2.5 text-base text-chalk outline-none focus:border-amber"
        />
      </div>
      {state.error && <p className="text-[13px] font-semibold text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex items-center justify-center gap-2.5 rounded-full bg-amber px-6 py-3.5 text-[13px] font-extrabold uppercase tracking-wider text-ink transition-all hover:-translate-y-0.5 disabled:opacity-60"
      >
        {pending ? "Хадгалж байна…" : "Нууц үг солих"}
      </button>
    </form>
  );
}
