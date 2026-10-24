import { NextResponse } from "next/server";
import { paymentsUnlocked, getPaymentSettings, ready } from "@/lib/payments";
export const runtime = "nodejs";
export async function GET() {
  const unlocked = await paymentsUnlocked(); const s = unlocked ? getPaymentSettings() : null;
  return NextResponse.json({unlocked, available:!!s && ready(s), mode:s?.mode || null}, {headers:{"Cache-Control":"private, no-store"}});
}
