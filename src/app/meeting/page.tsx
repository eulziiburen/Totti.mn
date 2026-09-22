import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Booking } from "@/components/BookingForm";

export const metadata: Metadata = {
  title: "Уулзалт товлох | ТОТТИ Спортын агент",
};

export default function MeetingPage() {
  return (
    <>
      <Header />
      <main className="pb-[90px] pt-[150px]">
        <div className="mx-auto max-w-[1180px] px-8">
          <Booking />
        </div>
      </main>
      <Footer />
    </>
  );
}
