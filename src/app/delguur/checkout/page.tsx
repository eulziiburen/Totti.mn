import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CheckoutForm } from "@/components/shop/CheckoutForm";
import { getCurrentCustomer } from "@/lib/customer-auth";

export const metadata: Metadata = {
  title: "Захиалга баталгаажуулах | ТОТТИ Дэлгүүр",
};

export default async function CheckoutPage() {
  const customer = await getCurrentCustomer();

  return (
    <>
      <Header />
      <main className="pb-[110px] pt-[150px]">
        <div className="mx-auto max-w-[1180px] px-8">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-amber">Захиалга</p>
          <h1 className="mt-3.5 font-display text-[clamp(28px,3.5vw,42px)] uppercase leading-[0.98]">
            ЗАХИАЛГА БАТАЛГААЖУУЛАХ
          </h1>
          <div className="mt-10">
            <CheckoutForm
              prefill={
                customer ? { name: customer.name, email: customer.email, phone: customer.phone ?? "" } : undefined
              }
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
