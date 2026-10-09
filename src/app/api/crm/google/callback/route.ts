import { NextResponse, type NextRequest } from "next/server";
import {
  GOOGLE_STATE_COOKIE,
  createCrmSession,
  isAllowedCrmEmail,
  isGoogleLoginConfigured,
} from "@/lib/crm-auth";
import { timingSafeStringEqual } from "@/lib/session-token";

type IdTokenClaims = { iss?: string; aud?: string; email?: string; email_verified?: boolean; exp?: number };

export async function GET(req: NextRequest) {
  const fail = (error: string) => {
    const res = NextResponse.redirect(new URL(`/crm/login?error=${error}`, req.url));
    res.cookies.delete({ name: GOOGLE_STATE_COOKIE, path: "/api/crm/google" });
    return res;
  };

  if (!isGoogleLoginConfigured()) return fail("google_off");

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state") ?? "";
  const expectedState = req.cookies.get(GOOGLE_STATE_COOKIE)?.value ?? "";
  if (!code || !expectedState || !timingSafeStringEqual(state, expectedState)) return fail("google");

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: new URL("/api/crm/google/callback", req.url).toString(),
      grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) return fail("google");
  const { id_token: idToken } = (await tokenRes.json()) as { id_token?: string };
  if (!idToken) return fail("google");

  // The ID token came straight from Google's token endpoint over TLS in exchange for our
  // client secret, so (per OpenID Connect) its claims can be read without checking the signature.
  const claims = decodeJwtPayload(idToken);
  const issuerOk = claims?.iss === "https://accounts.google.com" || claims?.iss === "accounts.google.com";
  if (!claims || !issuerOk || claims.aud !== process.env.GOOGLE_CLIENT_ID) return fail("google");
  if (!claims.email || claims.email_verified !== true) return fail("google");
  if (!isAllowedCrmEmail(claims.email)) return fail("not_allowed");

  await createCrmSession();
  const res = NextResponse.redirect(new URL("/crm", req.url));
  res.cookies.delete({ name: GOOGLE_STATE_COOKIE, path: "/api/crm/google" });
  return res;
}

function decodeJwtPayload(jwt: string): IdTokenClaims | null {
  const part = jwt.split(".")[1];
  if (!part) return null;
  try {
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    const bytes = Uint8Array.from(json, (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as IdTokenClaims;
  } catch {
    return null;
  }
}
