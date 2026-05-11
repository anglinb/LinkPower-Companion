// Offline JSON-LD validator for the static export. Walks every built
// blog HTML, parses every <script type="application/ld+json"> block,
// and checks each schema against required-field rules from
// schema.org / Google's rich-results docs.
//
// Run with `pnpm validate:jsonld` after `pnpm build`. Exits non-zero
// if any block is invalid.

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST_BLOG = path.join(ROOT, "out", "blog");

const REQUIRED = {
  Article: ["headline", "datePublished", "author", "image"],
  BreadcrumbList: ["itemListElement"],
  FAQPage: ["mainEntity"],
  HowTo: ["name", "step"],
};

let totalSchemas = 0;
const errors = [];

async function listPostDirs() {
  const entries = await fs.readdir(DIST_BLOG, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && e.name !== "_next")
    .map((e) => e.name);
}

function extractJsonLdBlocks(html) {
  const re = /<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi;
  const blocks = [];
  let m;
  while ((m = re.exec(html)) !== null) blocks.push(m[1].trim());
  return blocks;
}

function validate(schema, slug) {
  const type = schema["@type"];
  if (!type) {
    errors.push(`${slug}: schema missing @type`);
    return;
  }
  const required = REQUIRED[type];
  if (!required) return;
  for (const f of required) {
    if (schema[f] === undefined || schema[f] === null) {
      errors.push(`${slug}: ${type} missing required "${f}"`);
    }
  }
  if (type === "Article") {
    if (typeof schema.headline === "string" && schema.headline.length > 110) {
      errors.push(
        `${slug}: Article.headline ${schema.headline.length} chars (>110 recommended)`,
      );
    }
    if (typeof schema.datePublished === "string" &&
        !/^\d{4}-\d{2}-\d{2}/.test(schema.datePublished)) {
      errors.push(`${slug}: Article.datePublished not ISO 8601`);
    }
  }
  if (type === "BreadcrumbList" && Array.isArray(schema.itemListElement)) {
    schema.itemListElement.forEach((item, i) => {
      if (item.position !== i + 1) errors.push(`${slug}: breadcrumb item ${i} wrong position`);
    });
  }
  if (type === "FAQPage" && Array.isArray(schema.mainEntity)) {
    schema.mainEntity.forEach((q, i) => {
      if (q["@type"] !== "Question") errors.push(`${slug}: FAQ[${i}] not Question`);
      if (!q.acceptedAnswer || q.acceptedAnswer["@type"] !== "Answer") {
        errors.push(`${slug}: FAQ[${i}] missing acceptedAnswer.Answer`);
      }
    });
  }
  if (type === "HowTo" && Array.isArray(schema.step)) {
    schema.step.forEach((s, i) => {
      if (s["@type"] !== "HowToStep") errors.push(`${slug}: HowTo step[${i}] not HowToStep`);
      if (!s.name || !s.text) errors.push(`${slug}: HowTo step[${i}] missing name/text`);
    });
  }
}

async function main() {
  const dirs = await listPostDirs();
  for (const dir of dirs) {
    const file = path.join(DIST_BLOG, dir, "index.html");
    let html;
    try {
      html = await fs.readFile(file, "utf8");
    } catch {
      continue; // skip non-post dirs (like /blog/index.html, handled separately)
    }
    const blocks = extractJsonLdBlocks(html);
    process.stdout.write(`/blog/${dir}: ${blocks.length} schema(s)\n`);
    for (const block of blocks) {
      totalSchemas++;
      let parsed;
      try {
        parsed = JSON.parse(block);
      } catch (e) {
        errors.push(`${dir}: invalid JSON: ${e.message}`);
        continue;
      }
      const list = Array.isArray(parsed) ? parsed : parsed["@graph"] || [parsed];
      for (const t of list) validate(t, dir);
    }
  }

  if (errors.length === 0) {
    process.stdout.write(`\n✓ All ${totalSchemas} schemas valid.\n`);
    process.exit(0);
  } else {
    process.stdout.write(`\n✗ ${errors.length} error(s):\n`);
    for (const e of errors) process.stdout.write(`  - ${e}\n`);
    process.exit(1);
  }
}

main();
