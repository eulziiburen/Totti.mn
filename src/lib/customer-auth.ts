import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { customers } from "@/db/schema";
import { timingSafeStringEqual } from "./session-token";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days
const PBKDF2_ITERATIONS = 120_000;

export const CUSTOMER_SESSION_COOKIE_NAME = "totti_customer_session";

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET тохируулагдаагүй байна.");
  return secret;
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < view.length; i++) binary += String.fromCharCode(view[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(b64url: string): Uint8Array {
  const pad = (4 - (b64url.length % 4)) % 4;
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(pad);
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function derivePasswordHash(password: string, salt: Uint8Array): Promise<string> {
  const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    256
  );
  return toBase64Url(bits);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derivePasswordHash(password, salt);
  return `${toBase64Url(salt)}:${hash}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltB64, hashB64] = stored.split(":");
  if (!saltB64 || !hashB64) return false;
  const candidate = await derivePasswordHash(password, fromBase64Url(saltB64));
  return timingSafeStringEqual(candidate, hashB64);
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

async function buildCustomerToken(customerId: number): Promise<string> {
  const payload = `customer.${customerId}.${Date.now() + SESSION_MAX_AGE_SECONDS * 1000}`;
  const sig = await hmacSign(payload);
  return `${payload}.${sig}`;
}

async function verifyCustomerToken(token: string | undefined): Promise<number | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 4) return null;
  const [subject, idStr, expiry, sig] = parts;
  const expected = await hmacSign(`${subject}.${idStr}.${expiry}`);
  if (!timingSafeStringEqual(expected, sig)) return null;
  if (Date.now() > Number(expiry)) return null;
  if (subject !== "customer") return null;
  const id = Number(idStr);
  return Number.isInteger(id) ? id : null;
}

export async function createCustomerSession(customerId: number) {
  const store = await cookies();
  store.set(CUSTOMER_SESSION_COOKIE_NAME, await buildCustomerToken(customerId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function destroyCustomerSession() {
  const store = await cookies();
  store.delete(CUSTOMER_SESSION_COOKIE_NAME);
}

export async function getCurrentCustomerId(): Promise<number | null> {
  const store = await cookies();
  return verifyCustomerToken(store.get(CUSTOMER_SESSION_COOKIE_NAME)?.value);
}

export type Customer = {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  createdAt: string;
};

export async function getCurrentCustomer(): Promise<Customer | null> {
  const id = await getCurrentCustomerId();
  if (!id) return null;
  const [row] = await db.select().from(customers).where(eq(customers.id, id));
  if (!row) return null;
  return { id: row.id, email: row.email, name: row.name, phone: row.phone, createdAt: row.createdAt };
}
