import nodemailer from "nodemailer";

export type Mail = { to: string; replyTo?: string; subject: string; text: string; html: string };

/** True when an email provider (SendGrid API or SMTP) is configured. */
export function mailConfigured() {
  return Boolean(process.env.SENDGRID_API_KEY || (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS));
}

function parseFrom(value: string) {
  const match = value.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  return match ? { name: match[1].replace(/^"|"$/g, "") || undefined, email: match[2] } : { email: value.trim() };
}

/**
 * Sends a message through SendGrid's HTTPS API when SENDGRID_API_KEY is set
 * (works on hosts that block SMTP ports), otherwise through SMTP.
 */
export async function sendMail(mail: Mail) {
  const from = process.env.MAIL_FROM || process.env.SMTP_FROM || `KrishanTours Website <${process.env.SMTP_USER}>`;
  if (process.env.SENDGRID_API_KEY) {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        personalizations: [{ to: mail.to.split(",").map((email) => ({ email: email.trim() })) }],
        from: parseFrom(from),
        ...(mail.replyTo ? { reply_to: { email: mail.replyTo } } : {}),
        subject: mail.subject,
        content: [{ type: "text/plain", value: mail.text }, { type: "text/html", value: mail.html }],
        tracking_settings: { click_tracking: { enable: false }, open_tracking: { enable: false } },
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) throw new Error(`SendGrid ${response.status}: ${(await response.text()).slice(0, 300)}`);
    return;
  }
  const port = Number(process.env.SMTP_PORT || 587);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port, secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 15_000,
  });
  await transporter.sendMail({ from, ...mail });
}
