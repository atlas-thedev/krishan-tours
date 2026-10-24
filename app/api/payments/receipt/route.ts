import { NextRequest, NextResponse } from "next/server";
import { receipt, receiptCookie } from "@/lib/payments";
export const runtime = "nodejs";
export async function GET(request: NextRequest) {
  const id=(request.nextUrl.searchParams.get("order") || "").slice(0,100);
  let token="";
  try { const saved=JSON.parse(Buffer.from(request.cookies.get(receiptCookie)?.value || "", "base64url").toString()); if(saved.id===id && typeof saved.token==="string") token=saved.token; } catch {}
  const r=receipt(id,token);
  return NextResponse.json(r || {message:"Payment record not found."},{status:r?200:404,headers:{"Cache-Control":"private, no-store"}});
}
