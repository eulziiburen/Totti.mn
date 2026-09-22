import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ScrollProgress } from "@/components/ScrollProgress";
import { GrainOverlay } from "@/components/GrainOverlay";
import { PdfModalProvider } from "@/components/PdfModalProvider";

export const metadata: Metadata = {
  title: "ТОТТИ | Спортын агент",
  description:
    "ТОТТИ Спортын Агентлаг — сагсан бөмбөгийн тамирчдын карьерыг стратегийн түвшинд төлөвлөж, мэргэжлийн түвшинд удирдан хэрэгжүүлдэг агентлаг.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com/" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PdfModalProvider>
            <ScrollProgress />
            <GrainOverlay />
            {children}
          </PdfModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
