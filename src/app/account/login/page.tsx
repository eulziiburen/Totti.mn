import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getCurrentCustomer } from "@/lib/customer-auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Нэвтрэх | ТОТТИ Дэлгүүр" };

export default async function AccountLoginPage() {
  const customer = await getCurrentCustomer();
  if (customer) redirect("/account");

  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center px-6 pb-20 pt-[150px]">
        <div className="w-full max-w-sm rounded-3xl border border-line-strong bg-bg-0 p-8">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-amber">Дэлгүүрийн бүртгэл</p>
          <h1 className="mt-2 font-display text-3xl uppercase leading-none">Нэвтрэх</h1>
          <LoginForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
