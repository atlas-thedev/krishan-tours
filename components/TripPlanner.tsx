"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, LoaderCircle, Send } from "lucide-react";
import { useI18n } from "./I18nProvider";
import Link from "@/components/LocalizedLink";

type FormState = {
  timing: string;
  duration: string;
  group: string;
  interests: string[];
  pace: string;
  stay: string;
  budget: string;
  name: string;
  email: string;
  whatsapp: string;
  country: string;
  notes: string;
};
const initial: FormState = {
  timing: "",
  duration: "",
  group: "",
  interests: [],
  pace: "",
  stay: "",
  budget: "",
  name: "",
  email: "",
  whatsapp: "",
  country: "",
  notes: "",
};
const steps = [
  "When",
  "Length",
  "Travellers",
  "Interests",
  "Pace",
  "Stay",
  "Budget",
  "You",
];
const optionSets = {
  timing: ["I have exact dates", "I know the month", "I’m flexible"],
  duration: ["5–7 days", "8–10 days", "11–14 days", "15+ days"],
  group: ["Solo", "Couple", "Family", "Friends"],
  interests: [
    "Wildlife",
    "Beaches",
    "Culture",
    "Food",
    "Adventure",
    "Wellness",
    "Luxury",
    "Surfing",
    "Photography",
  ],
  pace: ["Relaxed", "Balanced", "See everything"],
  stay: ["Comfort", "Boutique", "Luxury", "A mix"],
  budget: [] as string[], // built from the admin-editable brackets, see budgetOptions()
};

const usd = (value: number) => `US$${Math.round(value).toLocaleString("en-US")}`;

export function TripPlanner({ budgetTiers = [1500, 2500, 4000] }: { budgetTiers?: number[] }) {
  const { t } = useI18n();
  // Stored value stays English (for the inquiry email); the label is translated.
  const [b1, b2, b3] = budgetTiers;
  const budgetOptions = [
    { value: `Under ${usd(b1)} pp`, label: t("Under {amount} per person", { amount: usd(b1) }) },
    { value: `${usd(b1)}–${usd(b2)} pp`, label: t("{from} – {to} per person", { from: usd(b1), to: usd(b2) }) },
    { value: `${usd(b2)}–${usd(b3)} pp`, label: t("{from} – {to} per person", { from: usd(b2), to: usd(b3) }) },
    { value: `${usd(b3)}+ pp`, label: t("{amount}+ per person", { amount: usd(b3) }) },
    { value: "Not sure yet", label: t("Not sure yet") },
  ];
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initial);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("krishan-trip");
      if (saved) queueMicrotask(() => setForm(JSON.parse(saved)));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem("krishan-trip", JSON.stringify(form));
    } catch {}
  }, [form]);
  const key = [
    "timing",
    "duration",
    "group",
    "interests",
    "pace",
    "stay",
    "budget",
  ][step] as keyof FormState;
  const select = (value: string) => {
    if (key === "interests")
      setForm((p) => ({
        ...p,
        interests: p.interests.includes(value)
          ? p.interests.filter((i) => i !== value)
          : [...p.interests, value],
      }));
    else setForm((p) => ({ ...p, [key]: value }));
  };
  const valid =
    step === 7
      ? !!(form.name && form.email)
      : key === "interests"
        ? form.interests.length > 0
        : !!form[key];
  const submit = async () => {
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "planner", ...form }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok)
        throw new Error(t(result.message || "Unable to send your request."));
      sessionStorage.removeItem("krishan-trip");
      setSent(true);
    } catch (problem) {
      setError(
        problem instanceof Error
          ? problem.message
          : t("Unable to send your request. Please try WhatsApp instead."),
      );
    } finally {
      setSending(false);
    }
  };
  if (sent)
    return (
      <div className="flex min-h-[32rem] flex-col items-center justify-center bg-paper px-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-jungle text-white">
          <Check />
        </span>
        <p className="eyebrow mt-7 text-cinnamon">{t("Request received")}</p>
        <h2 className="display mt-3 text-5xl">
          {t("We’ll take it from here.")}
        </h2>
        <p className="mt-5 max-w-md text-sm leading-6 text-black/60">
          {t(
            "Thanks, {name}. Your choices have been received securely. A real person from KrishanTours will reply to your email.",
            { name: form.name },
          )}
        </p>
      </div>
    );
  return (
    <div className="bg-paper shadow-[0_30px_80px_rgba(24,26,24,.12)]">
      <div className="border-b border-black/10 px-5 py-5 md:px-9">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-cinnamon">{t("Your Sri Lanka")}</p>
          <span className="text-xs tabular-nums text-black/45">
            {String(step + 1).padStart(2, "0")} / 08
          </span>
        </div>
        <div className="mt-4 h-1 bg-black/10">
          <div
            className="h-full bg-cinnamon transition-[width] duration-500"
            style={{ width: `${((step + 1) / 8) * 100}%` }}
          />
        </div>
        <div className="mt-3 hidden justify-between md:flex">
          {steps.map((item, index) => (
            <span
              key={item}
              className={`text-[.58rem] uppercase tracking-[.1em] ${index <= step ? "text-ink" : "text-black/25"}`}
            >
              {t(item)}
            </span>
          ))}
        </div>
      </div>
      <div className="min-h-[30rem] p-5 md:p-10">
        {step < 7 ? (
          <>
            <p className="eyebrow text-black/40">
              {t("Step")} {step + 1}
            </p>
            <h2 className="display mt-3 text-[clamp(2.8rem,7vw,5rem)] leading-[.9]">
              {t(
                [
                  "When are you travelling?",
                  "How long would you like?",
                  "Who is travelling?",
                  "What pulls you in?",
                  "What pace feels right?",
                  "How do you like to stay?",
                  "What budget feels comfortable?",
                ][step],
              )}
            </h2>
            <p className="mt-4 text-sm text-black/50">
              {t(
                step === 3
                  ? "Choose as many as you like."
                  : "Choose the closest answer. We can refine it later.",
              )}
            </p>
            <div
              className={`mt-9 grid gap-3 ${step === 3 ? "grid-cols-2 md:grid-cols-3" : "sm:grid-cols-2"}`}
            >
              {(key === "budget" ? budgetOptions : (optionSets[key as keyof typeof optionSets] || []).map((value) => ({ value, label: t(value) }))).map(
                ({ value, label }) => {
                  const chosen =
                    key === "interests"
                      ? form.interests.includes(value)
                      : form[key] === value;
                  return (
                    <button
                      type="button"
                      key={value}
                      onClick={() => select(value)}
                      className={`flex min-h-16 items-center justify-between border p-4 text-left text-sm transition-all ${chosen ? "border-jungle bg-jungle text-white" : "border-black/15 hover:border-jungle"}`}
                    >
                      <span>{label}</span>
                      {chosen && <Check size={16} />}
                    </button>
                  );
                },
              )}
            </div>
          </>
        ) : (
          <>
            <p className="eyebrow text-black/40">{t("One last step")}</p>
            <h2 className="display mt-3 text-[clamp(2.8rem,7vw,5rem)] leading-[.9]">
              {t("Where should we send your ideas?")}
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <Field
                label={t("Name")}
                value={form.name}
                onChange={(v) => setForm((p) => ({ ...p, name: v }))}
                auto="name"
              />
              <Field
                label={t("Email")}
                type="email"
                value={form.email}
                onChange={(v) => setForm((p) => ({ ...p, email: v }))}
                auto="email"
              />
              <Field
                label="WhatsApp"
                type="tel"
                value={form.whatsapp}
                onChange={(v) => setForm((p) => ({ ...p, whatsapp: v }))}
                auto="tel"
              />
              <Field
                label={t("Country")}
                value={form.country}
                onChange={(v) => setForm((p) => ({ ...p, country: v }))}
                auto="country-name"
              />
              <label className="sm:col-span-2">
                <span className="eyebrow text-black/50">
                  {t("Anything else?")}
                </span>
                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, notes: e.target.value }))
                  }
                  className="mt-2 w-full resize-none border border-black/15 bg-transparent p-4 outline-none focus:border-cinnamon"
                  placeholder={t(
                    "A celebration, must-see place, dietary needs…",
                  )}
                />
              </label>
            </div>
          </>
        )}
      </div>
      {step === 7 && <p className="px-5 pb-4 text-xs leading-5 text-black/50 md:px-10">
        {t("By sending this form, you ask KrishanTours to use these details to respond to your inquiry.")} {" "}
        <Link href="/privacy" className="underline">{t("Read our privacy policy")}</Link>.
      </p>}
      {error && (
        <p role="alert" className="px-5 pb-1 text-sm text-cinnamon md:px-9">
          {error}
        </p>
      )}
      <div className="flex items-center justify-between border-t border-black/10 p-5 md:px-9">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0 || sending}
          className="flex min-h-12 items-center gap-2 text-[.68rem] font-bold uppercase tracking-[.1em] disabled:opacity-20"
        >
          <ArrowLeft size={16} /> {t("Back")}
        </button>
        {step < 7 ? (
          <button
            type="button"
            disabled={!valid}
            onClick={() => setStep((s) => s + 1)}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-35"
          >
            {t("Continue")} <ArrowRight size={15} />
          </button>
        ) : (
          <button
            type="button"
            disabled={!valid || sending}
            onClick={submit}
            className="btn-primary disabled:opacity-35"
          >
            {sending ? (
              <>
                <LoaderCircle className="animate-spin" size={15} />
                {t("Sending")}
              </>
            ) : (
              <>
                {t("Create my journey")} <Send size={15} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  auto,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  auto: string;
}) {
  return (
    <label>
      <span className="eyebrow text-black/50">{label}</span>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={auto}
        className="mt-2 min-h-13 w-full border border-black/15 bg-transparent px-4 outline-none focus:border-cinnamon"
      />
    </label>
  );
}
