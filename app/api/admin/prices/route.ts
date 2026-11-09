import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/admin-auth";
import { resetPrice, savePrices } from "@/lib/content-db";
import { readJsonObject } from "@/lib/request-security";

export const runtime = "nodejs";

const valid = (value: unknown, allowNull = false) => (allowNull && value === null) || (typeof value === "number" && Number.isFinite(value) && value > 0 && value < 1_000_000);

export async function PUT(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false, message: "Your session has expired. Please sign in again." }, { status: 401 });
  let body: Record<string, unknown>;
  try { body = await readJsonObject(request); } catch { return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 }); }
  const updates = Array.isArray(body.updates) ? body.updates.slice(0, 200) as { key?: unknown; min?: unknown; max?: unknown }[] : [];
  const clean = updates.filter((u) => typeof u.key === "string" && valid(u.min) && valid(u.max ?? null, true) && (u.max == null || (u.max as number) >= (u.min as number)))
    .map((u) => ({ key: u.key as string, min: u.min as number, max: (u.max ?? null) as number | null }));
  if (!clean.length || clean.length !== updates.length) return NextResponse.json({ ok: false, message: "One or more prices are invalid." }, { status: 400 });
  savePrices(clean);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  let body: Record<string, unknown>;
  try { body = await readJsonObject(request); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  if (typeof body.key !== "string") return NextResponse.json({ ok: false }, { status: 400 });
  resetPrice(body.key);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
