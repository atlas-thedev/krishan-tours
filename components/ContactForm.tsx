"use client";

import { FormEvent, useState } from "react";
import { Check, LoaderCircle, Send } from "lucide-react";
import { useI18n } from "./I18nProvider";
import Link from "@/components/LocalizedLink";

type State = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const { t, locale } = useI18n();
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contact", ...payload, language: locale, page: window.location.pathname }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok)
        throw new Error(t(result.message || "Unable to send inquiry."));
      setState("sent");
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : t("Unable to send your inquiry. Please try WhatsApp instead."),
      );
    }
  }

  if (state === "sent")
    return (
      <div className="flex min-h-[26rem] flex-col items-center justify-center bg-paper p-8 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-jungle text-white">
          <Check />
        </span>
        <h2 className="display mt-6 text-5xl">{t("Thank you.")}</h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-black/55">
          {t(
            "Your inquiry has been received securely. KrishanTours will reply to the email address you provided.",
          )}
        </p>
      </div>
    );

  return (
    <form onSubmit={submit} className="bg-paper p-6 md:p-10">
      <h2 className="display text-5xl">{t("Tell us what you’re thinking.")}</h2>
      <p className="mt-4 max-w-lg text-sm leading-6 text-black/55">
        {t(
          "Dates can be approximate. “We like wildlife and hate rushing” is already useful.",
        )}
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Field label={t("Name")} name="name" auto="name" required />
        <Field
          label={t("Email")}
          name="email"
          type="email"
          auto="email"
          required
        />
        <Field label="WhatsApp" name="phone" type="tel" auto="tel" />
        <Field label={t("Travel month")} name="month" type="month" />
        <label className="sm:col-span-2">
          <span className="eyebrow text-black/50">{t("Your note")}</span>
          <textarea
            name="message"
            rows={6}
            required
            maxLength={4000}
            className="mt-2 w-full resize-none border border-black/15 bg-transparent p-4 outline-none focus:border-cinnamon"
            placeholder={t(
              "Who’s travelling, how long you have, and what you’d love to see…",
            )}
          />
        </label>
        <label className="absolute -left-[10000px]" aria-hidden="true">
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p className="mt-5 text-xs leading-5 text-black/50">
        {t("By sending this form, you ask KrishanTours to use these details to respond to your inquiry.")} {" "}
        <Link href="/privacy" className="underline">{t("Read our privacy policy")}</Link>.
      </p>
      {state === "error" && (
        <p role="alert" className="mt-5 text-sm text-cinnamon">
          {message}
        </p>
      )}
      <button
        className="btn-primary mt-7 disabled:cursor-wait disabled:opacity-60"
        type="submit"
        disabled={state === "sending"}
      >
        {state === "sending" ? (
          <>
            <LoaderCircle className="animate-spin" size={15} /> {t("Sending")}
          </>
        ) : (
          <>
            {t("Send inquiry")} <Send size={15} />
          </>
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  auto,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  auto?: string;
  required?: boolean;
}) {
  return (
    <label>
      <span className="eyebrow text-black/50">{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={auto}
        required={required}
        maxLength={180}
        className="mt-2 min-h-13 w-full border border-black/15 bg-transparent px-4 outline-none focus:border-cinnamon"
      />
    </label>
  );
}
