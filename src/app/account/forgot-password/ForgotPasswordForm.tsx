"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "../actions";

const initialState: { error?: string; done?: boolean } = {};

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialState);

  if (state.done) {
    return (
      <p className="mt-6 text-sm leading-relaxed text-muted">
        Хэрэв энэ имэйл хаягаар бүртгэл байгаа бол нууц үг сэргээх холбоос илгээгдлээ. Инбоксоо шалгана уу.
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-[13px] font-bold uppercase tracking-wide text-muted">
          Имэйл
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
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
        {pending ? "Илгээж байна…" : "Холбоос илгээх"}
      </button>
      <p className="text-center text-[13px] text-muted">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- plain <a> avoids a Next.js
            client-navigation scroll-restoration bug (jumps to a random scroll offset on <Link>) */}
        <a href="/account/login" className="font-semibold text-chalk underline">
          Нэвтрэх рүү буцах
        </a>
      </p>
    </form>
  );
}
