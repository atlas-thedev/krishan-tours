import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
import { postProcess } from "./i18n-postprocess.mjs";

const root = process.cwd();
const sourceFiles = [];
async function walk(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (/\.(ts|tsx)$/.test(entry.name)) sourceFiles.push(file);
  }
}
await walk(path.join(root, "app"));
await walk(path.join(root, "components"));

const sources = new Set();
// Module-level content arrays whose values are rendered through t().
const translatableVariables = ["nav", "regions", "tourTypes", "steps", "optionSets", "values", "sections", "homeFaqs", "driverFaqs", "privateTourFaqs", "packageFaqs", "packagesList", "transferFaqs", "transferRates", "tourFaqs", "itineraryDays", "rows", "themes"];
const addLiterals = (node) => {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) sources.add(node.text);
  ts.forEachChild(node, addLiterals);
};

for (const file of sourceFiles) {
  const text = await fs.readFile(file, "utf8");
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const visit = (node) => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && ["t", "localizedMetadata"].includes(node.expression.text) && node.arguments[0]) addLiterals(node.arguments[0]);
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && translatableVariables.includes(node.name.text) && node.initializer) addLiterals(node.initializer);
    // Inline content arrays rendered with `[...].map(item => t(item.x))`.
    if (ts.isPropertyAccessExpression(node) && node.name.text === "map" && ts.isArrayLiteralExpression(node.expression)) addLiterals(node.expression);
    ts.forEachChild(node, visit);
  };
  visit(source);
}

for (const name of ["destinations.ts", "experiences.ts", "faqs.ts", "stories.ts", "tours.ts"]) {
  const file = path.join(root, "data", name);
  const text = await fs.readFile(file, "utf8");
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const visit = (node) => {
    if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && !node.text.startsWith("/") && !node.text.startsWith("@")) {
      const isPropertyName = ts.isPropertyAssignment(node.parent) && node.parent.name === node;
      if (!isPropertyName) sources.add(node.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}

for (const value of ["Sri Lanka", "Choose language", "Skip to content", "Travel month", "Your note", "Sending", "Send inquiry", "Website"]) sources.add(value);
for (const value of ["Too many requests. Please try again shortly.", "Request is too large.", "Invalid request.", "Please provide a valid name and email address.", "We could not save your request. Please contact us on WhatsApp."]) sources.add(value);

const ignored = /^(en|ar|cs|fr|pl|de|idle|sending|sent|error|planner|contact|text|email|tel|month|yes|no|granted|denied|current-password|new-password)$/;
const list = [...sources].filter((value) => value.trim() && !value.startsWith("/") && !ignored.test(value) && !value.includes("className") && !/^https?:/.test(value)).sort((a,b) => a.localeCompare(b));
const targets = ["ar", "cs", "fr", "pl", "de"];

function protect(text) {
  const tokens = [];
  const protectedText = text.replace(/Krishan Tours|KrishanTours|Sri Lanka(?!n)|Sigiriya|Pidurangala|Arugam Bay|Nuwara Eliya|Udawalawe|WhatsApp|Google Analytics|Google|Cloudflare|SMTP|SQLite|IP address|JavaScript|Facebook|Instagram/g, (token) => {
    tokens.push(token);
    return ` __KT${tokens.length - 1}__ `;
  }).replace(/\{[^}]+\}/g, (token) => {
    tokens.push(token);
    return ` __KT${tokens.length - 1}__ `;
  });
  return { protectedText, restore(result) {
    tokens.forEach((token, index) => { result = result.replace(new RegExp(`__KT${index}__`, "gi"), token); });
    return result.trim();
  }};
}

async function translateBatch(texts, target) {
  const protectedItems = texts.map(protect);
  const url = new URL("https://clients5.google.com/translate_a/t");
  url.searchParams.set("client", "dict-chrome-ex"); url.searchParams.set("sl", "en"); url.searchParams.set("tl", target);
  for (const item of protectedItems) url.searchParams.append("q", item.protectedText);
  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await fetch(url, { headers: { "User-Agent": "KrishanTours translation build/1.0" } });
    if (response.ok) {
      const body = await response.json();
      if (!Array.isArray(body) || body.length !== texts.length) throw new Error(`Unexpected translation response: ${body.length}/${texts.length}`);
      return body.map((result, index) => protectedItems[index].restore(String(result)));
    }
    await new Promise((resolve) => setTimeout(resolve, 1_000 * (attempt + 1)));
  }
  throw new Error(`Translation failed (${target}): ${texts[0].slice(0, 60)}`);
}

for (const target of targets) {
  const outputFile = path.join(root, "lib", "i18n", "generated", `${target}.json`);
  let existing = {};
  if (process.env.REGENERATE !== "1") {
    try { existing = JSON.parse(await fs.readFile(outputFile, "utf8")); } catch {}
  }
  const output = { ...existing };
  const missing = list.filter((source) => !output[source]);
  while (missing.length) {
    const batch = [];
    let length = 200;
    while (missing.length && batch.length < 30) {
      const next = missing[0];
      const added = encodeURIComponent(next).length + 3;
      if (batch.length && length + added > 6_500) break;
      batch.push(missing.shift()); length += added;
    }
    const translated = await translateBatch(batch, target);
    batch.forEach((source, index) => { output[source] = postProcess(target, translated[index]); });
    await new Promise((resolve) => setTimeout(resolve, 120));
  }
  const sorted = Object.fromEntries(Object.entries(output).sort(([a],[b]) => a.localeCompare(b)));
  await fs.writeFile(outputFile, `${JSON.stringify(sorted, null, 2)}\n`);
  console.log(`${target}: ${Object.keys(sorted).length} entries`);
}
