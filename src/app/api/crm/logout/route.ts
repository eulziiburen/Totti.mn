import { NextResponse } from "next/server";
import { destroyCrmSession } from "@/lib/crm-auth";

export async function POST() {
  await destroyCrmSession();
  return new NextResponse(null, { status: 204 });
}
