import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ScrollProgress } from "@/components/ScrollProgress";
import { GrainOverlay } from "@/components/GrainOverlay";
import { PdfModalProvider } from "@/components/PdfModalProvider";
import { CartProvider } from "@/components/CartProvider";
import { CartDrawer } from "@/components/CartDrawer";
import { getPlayerDocuments } from "@/lib/content";

export const metadata: Metadata = {
  title: "ТОТТИ | Спортын агент",
  description:
    "ТОТТИ Спортын Агентлаг — сагсан бөмбөгийн тамирчдын карьерыг стратегийн түвшинд төлөвлөж, мэргэжлийн түвшинд удирдан хэрэгжүүлдэг агентлаг.",
};

export const revalidate = 60;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const documents = await getPlayerDocuments();

  return (
    <html lang="mn" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com/" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CartProvider>
            <PdfModalProvider documents={documents}>
              <ScrollProgress />
              <GrainOverlay />
              {children}
              <CartDrawer />
            </PdfModalProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
