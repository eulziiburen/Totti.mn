import { cookies } from "next/headers";
import {
  CRM_SESSION_COOKIE_NAME,
  CRM_SESSION_MAX_AGE_SECONDS,
  CRM_SESSION_SUBJECT,
  buildSessionToken,
  timingSafeStringEqual,
  verifySessionToken,
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

export async function createCrmSession() {
  const store = await cookies();
  store.set(
    CRM_SESSION_COOKIE_NAME,
    await buildSessionToken(CRM_SESSION_SUBJECT, CRM_SESSION_MAX_AGE_SECONDS),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: CRM_SESSION_MAX_AGE_SECONDS,
    }
  );
}

export async function destroyCrmSession() {
  const store = await cookies();
  store.delete(CRM_SESSION_COOKIE_NAME);
}

export async function isCrmAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(CRM_SESSION_COOKIE_NAME)?.value, CRM_SESSION_SUBJECT);
}
