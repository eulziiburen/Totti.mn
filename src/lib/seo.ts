import type { Metadata } from "next";
import type { Locale } from "./i18n";
import { SITE_URL } from "./site";

export function localizedPath(path: string, locale: Locale): string {
  return locale === "en" ? `${path}${path.includes("?") ? "&" : "?"}lang=en` : path;
}

// canonical + hreflang for a page that exists in both languages.
export function alternatesFor(path: string, locale: Locale): Metadata["alternates"] {
  return {
    canonical: localizedPath(path, locale),
    languages: {
      mn: path,
      en: localizedPath(path, "en"),
      "x-default": path,
    },
  };
}

export const ORGANIZATION = {
  name: "ТОТТИ Спортын Агентлаг",
  alternateName: ["TOTTI Sports Agency", "Totti Sports Agency", "ТОТТИ", "New Totti LLC", "Нью Тотти ХХК"],
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  email: "info@totti.mn",
  telephone: "+976 88602941",
  sameAs: [
    "https://www.instagram.com/tott1sports.agency/",
    "https://www.facebook.com/profile.php?id=61593814558102",
    "https://www.linkedin.com/company/new-totti-llc/",
  ],
};

export function organizationJsonLd(description: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SportsOrganization",
        "@id": `${SITE_URL}/#organization`,
        ...ORGANIZATION,
        description,
        sport: "Basketball",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Ulaanbaatar",
          addressRegion: "Sukhbaatar District",
          addressCountry: "MN",
        },
        areaServed: ["MN", "Worldwide"],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: ORGANIZATION.name,
        alternateName: ORGANIZATION.alternateName,
        inLanguage: ["mn", "en"],
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}
