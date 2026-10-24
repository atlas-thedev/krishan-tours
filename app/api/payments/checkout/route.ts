import { NextRequest, NextResponse } from "next/server";
import { paymentsUnlocked, createCheckout, receiptCookie } from "@/lib/payments";
import { readJsonObject, createRateLimiter, clientIp, sameOrigin } from "@/lib/request-security";
export const runtime = "nodejs";
const limit = createRateLimiter(10, 15*60*1000);
export async function POST(request: NextRequest) {
  if (!(await paymentsUnlocked())) return NextResponse.json({ok:false,message:"Payments are locked in this browser."},{status:403});
  if (!sameOrigin(request)) return NextResponse.json({ok:false,message:"Please pay from this website."},{status:403});
  const rate = limit.check(clientIp(request));
  if (rate.limited) return NextResponse.json({ok:false,message:"Too many attempts. Please try again later."},{status:429,headers:{"Retry-After":String(rate.retryAfter)}});
  try {
    const {receiptToken, orderId, ...checkout} = createCheckout(await readJsonObject(request,8000));
    const response = NextResponse.json({ok:true,...checkout}, {headers:{"Cache-Control":"no-store"}});
    response.cookies.set(receiptCookie, Buffer.from(JSON.stringify({id:orderId,token:receiptToken})).toString("base64url"), {httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:86400});
    return response;
  }
  catch(e) { return NextResponse.json({ok:false,message:e instanceof Error ? e.message : "Could not prepare payment."},{status:400}); }
}
