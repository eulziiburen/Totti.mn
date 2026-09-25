"use server";

import { redirect } from "next/navigation";
import { checkCredentials, createSession } from "@/lib/auth";

export type LoginState = { error?: string };

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!checkCredentials(username, password)) {
    return { error: "Нэвтрэх нэр эсвэл нууц үг буруу байна." };
  }

  await createSession();
  redirect(next.startsWith("/admin") ? next : "/admin");
}
