// Postbuild step: ensures the local-only `/screenshots/` route + source
// assets never make it into a deployed build.
//
// The screenshots generator lives in `src/app/screenshots/page.dev.tsx` and
// is gated via `pageExtensions` in `next.config.ts` — it isn't emitted as a
// route unless `INCLUDE_SCREENSHOTS=1` is set. However Next still copies
// everything under `public/` (including `public/screenshots/en/*.png`, which
// only the generator needs) into `out/`. This script removes the entire
// `out/screenshots/` folder when we're not building a local dev export, so
// the deployed site has no `/screenshots/` URL at all.
//
// Set `INCLUDE_SCREENSHOTS=1` (the `dev` and `build:with-screenshots` npm
// scripts both do this) to keep the folder for local inspection.

import { rm, stat } from "node:fs/promises";
import path from "node:path";

const includeScreenshots = process.env.INCLUDE_SCREENSHOTS === "1";

if (includeScreenshots) {
  console.log(
    "[strip-screenshots] INCLUDE_SCREENSHOTS=1 — keeping out/screenshots/.",
  );
  process.exit(0);
}

const target = path.resolve("out/screenshots");

try {
  await stat(target);
} catch {
  console.log("[strip-screenshots] out/screenshots/ not present — nothing to do.");
  process.exit(0);
}

await rm(target, { recursive: true, force: true });
console.log(
  "[strip-screenshots] Removed out/screenshots/ (production deploy build).",
);
