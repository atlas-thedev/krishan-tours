/** Send only anonymous, consented interaction data; never pass form fields here. */
export function trackInteraction(event: "generate_lead" | "contact", method: "contact_form" | "trip_planner" | "whatsapp" | "phone") {
  try {
    if (localStorage.getItem("krishantours-analytics-consent") !== "granted") return;
    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
    gtag?.("event", event, { method });
  } catch {
    // Analytics must never prevent an inquiry or contact link from working.
  }
}
