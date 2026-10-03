"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="username" className="text-xs font-bold uppercase tracking-wide text-muted">
          Нэвтрэх нэр
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          required
          className="w-full border-0 border-b-2 border-line-strong bg-transparent py-2.5 text-base text-chalk outline-none focus:border-amber"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-xs font-bold uppercase tracking-wide text-muted">
          Нууц үг
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full border-0 border-b-2 border-line-strong bg-transparent py-2.5 text-base text-chalk outline-none focus:border-amber"
        />
      </div>
      {state.error && <p className="text-[13px] font-semibold text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex items-center justify-center gap-2.5 bg-amber px-6 py-3.5 text-[13px] font-extrabold uppercase tracking-wider text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {pending ? "Түр хүлээнэ үү…" : "Нэвтрэх"}
      </button>
    </form>
  );
}
