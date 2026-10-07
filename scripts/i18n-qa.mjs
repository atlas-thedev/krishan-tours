import { chromium } from "playwright";

const baseUrl = process.env.QA_BASE_URL || "http://127.0.0.1:3418";
const locales = [
  ["en", "/", "ltr"], ["ar", "/ar", "rtl"], ["cs", "/cs", "ltr"],
  ["fr", "/fr", "ltr"], ["pl", "/pl", "ltr"], ["de", "/de", "ltr"],
];
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME || undefined });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const failures = [];

for (const [locale, path, direction] of locales) {
  const response = await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" });
  if (response?.status() !== 200) failures.push(`${locale}: HTTP ${response?.status()}`);
  const html = await page.locator("html").evaluate((element) => ({ lang: element.lang, dir: element.dir }));
  if (html.lang !== locale || html.dir !== direction) failures.push(`${locale}: html ${JSON.stringify(html)}`);
  if (locale !== "en") {
    const firstInternalLink = await page.locator(`a[href^="/${locale}"]`).first().getAttribute("href");
    if (!firstInternalLink) failures.push(`${locale}: no locale-preserving internal link`);
    if ((await page.locator("body").innerText()).includes("Discover Sri Lanka")) failures.push(`${locale}: untranslated home hero`);
  }
  if (await page.locator('script[src*="googletagmanager"]').count()) failures.push(`${locale}: analytics loaded before consent`);
}

await page.goto(`${baseUrl}/fr/tours?style=Wildlife`, { waitUntil: "networkidle" });
const selected = await page.locator('[aria-pressed="true"]').first().innerText();
if (/^all$/i.test(selected)) failures.push("tour query filter was ignored");

await page.goto(`${baseUrl}/ar/privacy`, { waitUntil: "networkidle" });
if ((await page.locator("body").innerText()).includes("This production preview")) failures.push("old privacy placeholder remains");

await browser.close();
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("I18N_QA_OK");
