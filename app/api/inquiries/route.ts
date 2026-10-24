import { randomUUID } from "node:crypto";
import { mailConfigured, sendMail } from "@/lib/mailer";
import { NextRequest, NextResponse } from "next/server";
import { saveInquiry } from "@/lib/inquiries-db";
import { isLocale, localeNames } from "@/lib/i18n/config";
import { clientIp, createRateLimiter, readJsonObject, RequestBodyError } from "@/lib/request-security";

export const runtime = "nodejs";

const destinationEmail = process.env.CONTACT_TO_EMAIL || "iwantu226@gmail.com";
const inquiryRateLimit = createRateLimiter(5, 15 * 60_000);

function text(value: unknown, max = 2_000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] || character);
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  const rate = inquiryRateLimit.check(ip);
  if (rate.limited) return NextResponse.json({ ok: false, message: "Too many requests. Please try again shortly." }, { status: 429, headers: { "Retry-After": String(rate.retryAfter) } });

  let raw: Record<string, unknown>;
  try {
    raw = await readJsonObject(request);
  } catch (error) {
    const tooLarge = error instanceof RequestBodyError && error.reason === "too-large";
    return NextResponse.json({ ok: false, message: tooLarge ? "Request is too large." : "Invalid request." }, { status: tooLarge ? 413 : 400 });
  }

  // A hidden field catches simple form bots without inconveniencing travellers.
  if (text(raw.website, 200)) return NextResponse.json({ ok: true });

  const type: "planner" | "contact" = raw.type === "planner" ? "planner" : "contact";
  const name = text(raw.name, 120);
  const email = text(raw.email, 180).toLowerCase();
  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ ok: false, message: "Please provide a valid name and email address." }, { status: 400 });
  }

  const inquiry = {
    id: randomUUID(),
    receivedAt: new Date().toISOString(),
    type,
    name,
    email,
    phone: text(raw.phone || raw.whatsapp, 80),
    month: text(raw.month, 80),
    message: text(raw.message || raw.notes, 4_000),
    timing: text(raw.timing, 120),
    duration: text(raw.duration, 120),
    group: text(raw.group, 120),
    interests: Array.isArray(raw.interests) ? raw.interests.map((item) => text(item, 80)).filter(Boolean).slice(0, 20) : [],
    pace: text(raw.pace, 120),
    stay: text(raw.stay, 120),
    budget: text(raw.budget, 120),
    country: text(raw.country, 120),
    ip,
    language: isLocale(text(raw.language, 8)) ? text(raw.language, 8) : "en",
    page: text(raw.page, 200).startsWith("/") ? text(raw.page, 200) : "",
  };

  try {
    saveInquiry(inquiry);
  } catch (error) {
    console.error("Unable to persist inquiry", error);
    return NextResponse.json({ ok: false, message: "We could not save your request. Please contact us on WhatsApp." }, { status: 500 });
  }

  const rows = [
    ["Reference", inquiry.id], ["Inquiry", inquiry.type], ["Name", inquiry.name], ["Email", inquiry.email],
    ["WhatsApp / phone", inquiry.phone], ["Travel month", inquiry.month], ["Timing", inquiry.timing],
    ["Duration", inquiry.duration], ["Travellers", inquiry.group], ["Interests", inquiry.interests.join(", ")],
    ["Pace", inquiry.pace], ["Accommodation", inquiry.stay], ["Budget", inquiry.budget],
    ["Country", inquiry.country], ["Language", `${localeNames[inquiry.language as keyof typeof localeNames] || inquiry.language} (${inquiry.language})`], ["Page", inquiry.page], ["Message", inquiry.message], ["Received", inquiry.receivedAt],
  ].filter(([, value]) => value);

  let delivered = false;
  if (mailConfigured()) {
    try {
      await sendMail({
        to: destinationEmail,
        replyTo: inquiry.email,
        subject: `${inquiry.language !== "en" ? `[${inquiry.language.toUpperCase()}] ` : ""}${type === "planner" ? "Trip plan" : "Website inquiry"} from ${inquiry.name}`,
        text: rows.map(([label, value]) => `${label}: ${value}`).join("\n"),
        html: `<div style="font-family:Arial,sans-serif;max-width:680px"><h1 style="color:#17382b">New KrishanTours ${type === "planner" ? "trip plan" : "inquiry"}</h1>${rows.map(([label, value]) => `<p><strong>${escapeHtml(String(label))}:</strong><br>${escapeHtml(String(value))}</p>`).join("")}</div>`,
      });
      delivered = true;
    } catch (error) {
      console.error("Inquiry saved but email delivery failed", error);
    }
  }

  return NextResponse.json({ ok: true, delivered, reference: inquiry.id }, { status: delivered ? 200 : 202 });
}
