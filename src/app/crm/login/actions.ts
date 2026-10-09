"use server";

import { redirect } from "next/navigation";
import { checkCrmCredentials, createCrmSession } from "@/lib/crm-auth";

export type CrmLoginState = { error?: string };

export async function crmLoginAction(
  _prevState: CrmLoginState,
  formData: FormData
): Promise<CrmLoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!checkCrmCredentials(username, password)) {
    return { error: "Нэвтрэх нэр эсвэл код буруу байна." };
  }

  await createCrmSession(username);
  redirect("/crm");
}
