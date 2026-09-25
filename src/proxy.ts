import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session-token";
import { LOCALE_COOKIE, LOCALE_HEADER, isLocale } from "@/lib/i18n";

export async function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!(await verifySessionToken(token))) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // "?lang=en" gives each language its own crawlable URL. It wins over the cookie
  // for this request and is remembered so the visitor stays in that language.
  const lang = searchParams.get("lang");
  if (isLocale(lang)) {
    const headers = new Headers(req.headers);
    headers.set(LOCALE_HEADER, lang);
    const res = NextResponse.next({ request: { headers } });
    res.cookies.set(LOCALE_COOKIE, lang, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|images/|documents/|favicon.ico|robots.txt|sitemap.xml|api/).*)"],
};
