// Shared clean-up for machine translations: fixes spacing around protected tokens
// and common grammar slips with the country name. Used by generate-translations.mjs
// and runnable on its own: `node scripts/i18n-postprocess.mjs`.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function postProcess(target, text) {
  let out = String(text)
    .replace(/\s{2,}/g, " ")
    .replace(/(\{[^}]+\}) -(?=\p{L})/gu, "$1-")
    .replace(/(\S) ([,.!?])(?=\s|$)/g, "$1$2")
    .replace(/Sri Lanka\s?n\b/g, "Sri Lanka")
    .trim();
  if (target === "fr") out = out.replace(/\b(à|en) Sri Lanka\b/g, "au Sri Lanka").replace(/\bde Sri Lanka\b/g, "du Sri Lanka").replace(/\bdu Sri Lanka\b/g, "du Sri Lanka");
  if (target === "de") out = out.replace(/\bim Sri Lanka\b/g, "in Sri Lanka");
  return out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = path.join(process.cwd(), "lib", "i18n", "generated");
  for (const target of ["ar", "cs", "fr", "pl", "de"]) {
    const file = path.join(dir, `${target}.json`);
    const data = JSON.parse(await fs.readFile(file, "utf8"));
    let changed = 0;
    for (const [key, value] of Object.entries(data)) {
      const next = postProcess(target, value);
      if (next !== value) { data[key] = next; changed++; }
    }
    await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
    console.log(`${target}: ${changed} cleaned`);
  }
}
