import { NextResponse, type NextRequest } from "next/server";
import { GOOGLE_STATE_COOKIE, isGoogleLoginConfigured } from "@/lib/crm-auth";

// Starts "Google-ээр нэвтрэх": sends the browser to Google with a one-time state value
// that the callback checks against this cookie.
export async function GET(req: NextRequest) {
  if (!isGoogleLoginConfigured()) {
    return NextResponse.redirect(new URL("/crm/login?error=google_off", req.url));
  }

  const state = crypto.randomUUID();
  const auth = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  auth.search = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: new URL("/api/crm/google/callback", req.url).toString(),
    response_type: "code",
    scope: "openid email",
    state,
    prompt: "select_account",
  }).toString();

  const res = NextResponse.redirect(auth);
  res.cookies.set(GOOGLE_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/crm/google",
    maxAge: 60 * 10,
  });
  return res;
}
