import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ScrollProgress } from "@/components/ScrollProgress";
import { GrainOverlay } from "@/components/GrainOverlay";
import { PdfModalProvider } from "@/components/PdfModalProvider";
import { LocaleProvider } from "@/components/LocaleProvider";
import { getPlayerDocuments } from "@/lib/content";
import { getI18n } from "@/lib/locale";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return {
    metadataBase: new URL(SITE_URL),
    title: t.meta.title,
    description: t.meta.description,
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      siteName: t.meta.siteName,
      locale: locale === "en" ? "en_US" : "mn_MN",
      type: "website",
      images: [{ url: "/images/hero-basketball.png", width: 2200, height: 782 }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [{ locale }, documents] = await Promise.all([getI18n(), getPlayerDocuments()]);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com/" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LocaleProvider locale={locale}>
            <PdfModalProvider documents={documents}>
              <ScrollProgress />
              <GrainOverlay />
              {children}
            </PdfModalProvider>
          </LocaleProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
