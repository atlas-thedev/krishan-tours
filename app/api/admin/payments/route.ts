import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { publicSettings, savePaymentSettings } from "@/lib/payments";
import { readJsonObject, sameOrigin } from "@/lib/request-security";
export const runtime = "nodejs";
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ok:false}, {status:401});
  return NextResponse.json(publicSettings(), {headers:{"Cache-Control":"no-store"}});
}
export async function PUT(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ok:false}, {status:401});
  if (!sameOrigin(request)) return NextResponse.json({ok:false,message:"Please save from this website."}, {status:403});
  try { return NextResponse.json({ok:true,settings:savePaymentSettings(await readJsonObject(request, 8000))}, {headers:{"Cache-Control":"no-store"}}); }
  catch(e) { return NextResponse.json({ok:false,message:e instanceof Error ? e.message : "Could not save settings."}, {status:400}); }
}
