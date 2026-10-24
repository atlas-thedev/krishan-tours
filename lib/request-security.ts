import type { NextRequest } from "next/server";

export function clientIp(request: NextRequest) {
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function createRateLimiter(limit: number, windowMs: number, maxEntries = 10_000) {
  const attempts = new Map<string, { count: number; resetAt: number }>();
  const check = (key: string) => {
    const now = Date.now();
    if (attempts.size >= maxEntries) {
      for (const [candidate, value] of attempts) {
        if (value.resetAt <= now || attempts.size >= maxEntries) attempts.delete(candidate);
        if (attempts.size < maxEntries) break;
      }
    }
    const current = attempts.get(key);
    if (!current || current.resetAt <= now) {
      attempts.set(key, { count: 1, resetAt: now + windowMs });
      return { limited: false, retryAfter: 0 };
    }
    current.count += 1;
    return { limited: current.count > limit, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1_000)) };
  };
  return { check, reset: (key: string) => attempts.delete(key) };
}

export async function readJsonObject(request: NextRequest, maxBytes = 64_000) {
  const declared = Number(request.headers.get("content-length") || 0);
  if (declared > maxBytes) throw new RequestBodyError("too-large");
  const raw = await request.text();
  if (Buffer.byteLength(raw, "utf8") > maxBytes) throw new RequestBodyError("too-large");
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    return parsed as Record<string, unknown>;
  } catch {
    throw new RequestBodyError("invalid");
  }
}

export class RequestBodyError extends Error {
  constructor(public reason: "too-large" | "invalid") { super(reason); }
}

// Compare the browser origin with the actual request host. Next's internal URL
// can use localhost behind a reverse proxy; Nginx supplies the original scheme.
export function sameOrigin(request: NextRequest) {
  try {
    const origin = new URL(request.headers.get("origin") || "");
    const protocol = (request.headers.get("x-forwarded-proto") || request.nextUrl.protocol.replace(":", "")).split(",")[0].trim();
    return origin.host === request.headers.get("host") && origin.protocol === protocol + ":" && ["http", "https"].includes(protocol);
  } catch { return false; }
}
