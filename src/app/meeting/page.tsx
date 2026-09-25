import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Booking } from "@/components/BookingForm";
import { getI18n } from "@/lib/locale";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return { title: t.meta.meetingTitle, alternates: alternatesFor("/meeting", locale) };
}

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
