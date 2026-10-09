import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isCrmAuthenticated } from "@/lib/crm-auth";
import { CrmLoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Totti CRM · Нэвтрэх",
  robots: { index: false, follow: false },
};

export default async function CrmLoginPage() {
  if (await isCrmAuthenticated()) redirect("/crm");

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-1 px-6">
      <div className="w-full max-w-sm border border-line-strong bg-bg-0 p-8">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-amber">ТОТТИ CRM</p>
        <h1 className="mt-2 font-display text-3xl uppercase leading-none">Нэвтрэх</h1>
        <CrmLoginForm />
      </div>
    </div>
  );
}
