import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata: Metadata = { title: "Нууц үг сэргээх | ТОТТИ Дэлгүүр" };

export default function ForgotPasswordPage() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center px-6 pb-20 pt-[150px]">
        <div className="w-full max-w-sm rounded-3xl border border-line-strong bg-bg-0 p-8">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-amber">Дэлгүүрийн бүртгэл</p>
          <h1 className="mt-2 font-display text-3xl uppercase leading-none">Нууц үг сэргээх</h1>
          <ForgotPasswordForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
