import { NextRequest, NextResponse } from "next/server";
import { processNotification } from "@/lib/payments";
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  if (!request.headers.get("content-type")?.startsWith("application/x-www-form-urlencoded")) return new NextResponse("Unsupported content type",{status:415});
  if (Number(request.headers.get("content-length") || 0)>16000) return new NextResponse("Too large",{status:413});
  const raw = await request.text(); if (Buffer.byteLength(raw)>16000) return new NextResponse("Too large",{status:413});
  const params = new URLSearchParams(raw);
  for (const key of ["merchant_id","order_id","payhere_amount","payhere_currency","status_code","md5sig","payment_id"]) {
    if (params.getAll(key).length!==1) return new NextResponse("Invalid notification",{status:400});
  }
  try { processNotification(params); return new NextResponse("OK",{headers:{"Cache-Control":"no-store"}}); }
  catch { return new NextResponse("Invalid notification",{status:400}); }
}
