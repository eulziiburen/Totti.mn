"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { customers } from "@/db/schema";
import {
  createCustomerSession,
  destroyCustomerSession,
  generatePasswordResetToken,
  getCurrentCustomer,
  hashPassword,
  hashResetToken,
  isResetTokenExpired,
  resetTokenExpiry,
  verifyPassword,
} from "@/lib/customer-auth";
import { sendEmailSafely } from "@/lib/email";
import { passwordResetEmailHtml, welcomeEmailHtml } from "@/lib/email-templates";

export type AccountFormState = { error?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function registerCustomer(
  _prevState: AccountFormState,
  formData: FormData
): Promise<AccountFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    return { error: "Нэр, имэйл, нууц үг шаардлагатай." };
  }
  if (!EMAIL_RE.test(email)) {
    return { error: "Имэйл хаягийн формат буруу байна." };
  }
  if (password.length < 8) {
    return { error: "Нууц үг доод тал нь 8 тэмдэгт байх ёстой." };
  }

  const existing = await db.select().from(customers).where(eq(customers.email, email));
  if (existing.length > 0) {
    return { error: "Энэ имэйл хаягаар бүртгэл аль хэдийн үүссэн байна." };
  }

  const passwordHash = await hashPassword(password);
  const [row] = await db
    .insert(customers)
    .values({ name, email, phone: phone || null, passwordHash })
    .returning();

  const welcome = welcomeEmailHtml(name);
  await sendEmailSafely({ to: email, subject: welcome.subject, html: welcome.html });

  await createCustomerSession(row.id);
  redirect("/account");
}

export async function loginCustomer(
  _prevState: AccountFormState,
  formData: FormData
): Promise<AccountFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Имэйл, нууц үгээ оруулна уу." };
  }

  const [row] = await db.select().from(customers).where(eq(customers.email, email));
  if (!row || !(await verifyPassword(password, row.passwordHash))) {
    return { error: "Имэйл эсвэл нууц үг буруу байна." };
  }

  await createCustomerSession(row.id);
  redirect("/account");
}

export async function logoutCustomer() {
  await destroyCustomerSession();
  redirect("/");
}

export async function getAccountStatus(): Promise<{ loggedIn: boolean; name?: string }> {
  const customer = await getCurrentCustomer();
  return customer ? { loggedIn: true, name: customer.name } : { loggedIn: false };
}

// Always returns a generic success state regardless of whether the email exists —
// never reveal account existence to an unauthenticated caller.
export async function requestPasswordReset(
  _prevState: AccountFormState & { done?: boolean },
  formData: FormData
): Promise<AccountFormState & { done?: boolean }> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return { error: "Имэйл хаягаа оруулна уу." };

  const [row] = await db.select().from(customers).where(eq(customers.email, email));
  if (row) {
    const token = generatePasswordResetToken();
    await db
      .update(customers)
      .set({ resetTokenHash: await hashResetToken(token), resetTokenExpiresAt: resetTokenExpiry() })
      .where(eq(customers.id, row.id));

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
    const resetUrl = `${siteUrl}/account/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
    const mail = passwordResetEmailHtml(resetUrl);
    await sendEmailSafely({ to: email, subject: mail.subject, html: mail.html });
  }

  return { done: true };
}

export async function resetPassword(
  _prevState: AccountFormState & { done?: boolean },
  formData: FormData
): Promise<AccountFormState & { done?: boolean }> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !token || !password) return { error: "Хүчингүй холбоос байна." };
  if (password.length < 8) return { error: "Нууц үг доод тал нь 8 тэмдэгт байх ёстой." };

  const [row] = await db.select().from(customers).where(eq(customers.email, email));
  if (!row || !row.resetTokenHash || isResetTokenExpired(row.resetTokenExpiresAt)) {
    return { error: "Холбоосны хугацаа дууссан эсвэл хүчингүй байна. Дахин хүсэлт илгээнэ үү." };
  }

  const candidateHash = await hashResetToken(token);
  const { timingSafeStringEqual } = await import("@/lib/session-token");
  if (!timingSafeStringEqual(candidateHash, row.resetTokenHash)) {
    return { error: "Холбоосны хугацаа дууссан эсвэл хүчингүй байна. Дахин хүсэлт илгээнэ үү." };
  }

  const passwordHash = await hashPassword(password);
  await db
    .update(customers)
    .set({ passwordHash, resetTokenHash: null, resetTokenExpiresAt: null })
    .where(eq(customers.id, row.id));

  return { done: true };
}
