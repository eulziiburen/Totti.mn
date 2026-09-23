import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata: Metadata = { title: "Шинэ нууц үг | ТОТТИ Дэлгүүр" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>;
}) {
  const { token, email } = await searchParams;

  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center px-6 pb-20 pt-[150px]">
        <div className="w-full max-w-sm rounded-3xl border border-line-strong bg-bg-0 p-8">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-amber">Дэлгүүрийн бүртгэл</p>
          <h1 className="mt-2 font-display text-3xl uppercase leading-none">Шинэ нууц үг</h1>
          {token && email ? (
            <ResetPasswordForm token={token} email={email} />
          ) : (
            <p className="mt-6 text-sm text-red-600">Холбоос хүчингүй байна.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
