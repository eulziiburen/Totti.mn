import { cookies } from "next/headers";
import {
  CRM_SESSION_COOKIE_NAME,
  CRM_SESSION_MAX_AGE_SECONDS,
  buildCrmSessionToken,
  timingSafeStringEqual,
  verifyCrmSessionToken,
} from "./session-token";

// The CRM has its own login (CRM_USERNAME / CRM_PASSWORD) so the team can use it
// without getting access to the site admin.
export function checkCrmCredentials(username: string, password: string): boolean {
  const expectedUser = process.env.CRM_USERNAME ?? "";
  const expectedPass = process.env.CRM_PASSWORD ?? "";
  if (!expectedUser || !expectedPass) return false;
  return (
    timingSafeStringEqual(username, expectedUser) && timingSafeStringEqual(password, expectedPass)
  );
}

// Google sign-in: only addresses listed in CRM_ALLOWED_EMAILS (comma-separated) get in.
export function isAllowedCrmEmail(email: string): boolean {
  const allowed = (process.env.CRM_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.trim().toLowerCase());
}

// One-time state for the Google round trip (set in /api/crm/google, checked in its callback).
export const GOOGLE_STATE_COOKIE = "totti_crm_oauth_state";

export function isGoogleLoginConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

// `user` is the Google email, or the username for the code login; it is what the change log shows.
export async function createCrmSession(user: string) {
  const store = await cookies();
  store.set(CRM_SESSION_COOKIE_NAME, await buildCrmSessionToken(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CRM_SESSION_MAX_AGE_SECONDS,
  });
}

export async function destroyCrmSession() {
  const store = await cookies();
  store.delete(CRM_SESSION_COOKIE_NAME);
}

// The signed-in CRM user, or null when there is no valid session.
export async function getCrmUser(): Promise<string | null> {
  const store = await cookies();
  return verifyCrmSessionToken(store.get(CRM_SESSION_COOKIE_NAME)?.value);
}

export async function isCrmAuthenticated(): Promise<boolean> {
  return (await getCrmUser()) !== null;
}
