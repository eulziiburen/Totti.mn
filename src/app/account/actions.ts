"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { customers } from "@/db/schema";
import {
  createCustomerSession,
  destroyCustomerSession,
  getCurrentCustomer,
  hashPassword,
  verifyPassword,
} from "@/lib/customer-auth";

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
