import type { NextConfig } from "next";

/**
 * The screenshot generator at `app/screenshots/` is a local-only tool that
 * lets us render and download App Store screenshots. We don't want it
 * shipping to production because:
 *   - It's a heavy client-only component (`html-to-image`, large PNG sources).
 *   - It would 404 / get crawled despite our `noindex` meta on some bots.
 *   - The audit kept flagging `/screenshots/` as a robots-blocked / redirect /
 *     non-indexable noise source.
 *
 * Gating mechanism: the two files in `src/app/screenshots/` are named
 * `page.dev.tsx` and `layout.dev.tsx`. Next.js's `pageExtensions` controls
 * which suffixes count as route files — when `INCLUDE_SCREENSHOTS=1` we add
 * `dev.tsx` to the list, so the screenshots route is built. Otherwise the
 * `.dev.tsx` files are treated as ordinary modules and no route is emitted.
 *
 * The `dev` npm script sets `INCLUDE_SCREENSHOTS=1`; production builds don't.
 * A postbuild script (`scripts/strip-screenshots.mjs`) belt-and-suspenders the
 * cleanup by deleting any leftover `out/screenshots/` directory (which can
 * otherwise contain the source PNGs copied from `public/screenshots/`).
 */
const includeScreenshots = process.env.INCLUDE_SCREENSHOTS === "1";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  pageExtensions: includeScreenshots
    ? ["dev.tsx", "tsx", "ts", "jsx", "js"]
    : ["tsx", "ts", "jsx", "js"],
};

export default nextConfig;
