# LP3 website pages

Implementation lives in this isolated worktree on `codex/lp3-website`.

## Pages

- `/linkpower-3-quick-start/`: hardware setup, charging, specifications, companion compatibility, and help.
- `/linkpower-3-connection-guide/`: distinguishes Companion Bluetooth from PeakDo's web app and cloud binding.
- Existing homepage, manual (HTML and PDF), LP1/LP2 guide links, footer, troubleshooting, and sitemap updated.

## Official sources

- https://www.peakdo.com/products/linkpower3-battery
- https://images.51microshop.com/15666/user_guide/linkpower_3/LinkPower-3_quick_start_v3.0.pdf
- https://www.peakdo.com/blogs/news/why-we-upgraded-linkpower-3s-wi-fi-capabilities

Checked September 26, 2026. The manual has conflicting sleep/shutdown timings; the guide deliberately directs users to firmware-specific instructions instead of asserting a single timing. No assumption is made that LP3 development-build support has shipped to both app stores, or that Companion implements PeakDo's cloud API.

## Website baseline

The original Git checkout omitted most `src/app` routes because its `app/` ignore rule also matched the Next.js directory. This worktree restores the existing deployed website sources from the validated troubleshooting deployment snapshot, including existing Android website changes. `.gitignore` now only excludes the root `/app/` private iOS checkout. Other agents' worktrees were not modified.

## Validation and deployment

- Next.js production export via `next build --webpack`; production screenshot stripping script applied.
- Existing JSON-LD validation passed (13 schemas).
- Mobile viewport checks: both new routes have no horizontal overflow at 390px.
- Topic-anchor and internal-link validation against the static export.
- Manual PDF regenerated using the repository's existing script and copied into `out`.
- Cloudflare Pages project: `linkpower`, production branch: `main`.
