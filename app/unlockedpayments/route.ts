import { NextResponse } from "next/server";
import { createUnlockToken, unlockCookie } from "@/lib/payments";
import { siteConfig } from "@/lib/site";
export const runtime = "nodejs";
export async function GET() {
  const response=NextResponse.redirect(`${siteConfig.url}/pay-for-booking`,303);
  response.cookies.set(unlockCookie,createUnlockToken(),{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:86400});
  response.headers.set("Cache-Control","private, no-store"); response.headers.set("X-Robots-Tag","noindex, nofollow");
  return response;
}
