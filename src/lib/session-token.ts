const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET тохируулагдаагүй байна.");
  return secret;
}

function toBase64Url(bytes: ArrayBuffer): string {
  let binary = "";
  const view = new Uint8Array(bytes);
  for (let i = 0; i < view.length; i++) binary += String.fromCharCode(view[i]);
  const b64 = btoa(binary);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function timingSafeStringEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function hmacSign(value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return toBase64Url(sig);
}

export async function buildSessionToken(): Promise<string> {
  const payload = `admin.${Date.now() + MAX_AGE_SECONDS * 1000}`;
  const sig = await hmacSign(payload);
  return `${payload}.${sig}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [subject, expiry, sig] = parts;
  const payload = `${subject}.${expiry}`;
  const expected = await hmacSign(payload);
  if (!timingSafeStringEqual(expected, sig)) return false;
  if (Date.now() > Number(expiry)) return false;
  return subject === "admin";
}

export const SESSION_COOKIE_NAME = "totti_admin_session";
export const SESSION_MAX_AGE_SECONDS = MAX_AGE_SECONDS;

export const CRM_SESSION_COOKIE_NAME = "totti_crm_session";
export const CRM_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14; // 14 days: the team uses the CRM daily

// CRM sessions carry who is signed in (a Google email, or the code-login username) so
// every change can be attributed: "crm.<base64url user>.<expiry>.<sig>".
export async function buildCrmSessionToken(user: string): Promise<string> {
  const payload = `crm.${toBase64Url(new TextEncoder().encode(user).buffer as ArrayBuffer)}.${Date.now() + CRM_SESSION_MAX_AGE_SECONDS * 1000}`;
  return `${payload}.${await hmacSign(payload)}`;
}

export async function verifyCrmSessionToken(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 4 || parts[0] !== "crm") return null;
  const [, user, expiry, sig] = parts;
  if (!timingSafeStringEqual(await hmacSign(`crm.${user}.${expiry}`), sig)) return null;
  if (Date.now() > Number(expiry)) return null;
  try {
    const binary = atob(user.replace(/-/g, "+").replace(/_/g, "/"));
    return new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
  } catch {
    return null;
  }
}
