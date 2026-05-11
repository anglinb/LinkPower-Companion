// Generate the user-manual PDF from the live `/manual/` page.
//
// Why headless Chrome and not a Markdown→PDF tool: the manual page is
// already styled for both web and print (with @media print rules,
// @page footers, page-break-before: always at chapters). Rendering
// the same page through Chrome gives us a perfect single source of
// truth — edits to the web manual automatically flow into the PDF on
// next build, no separate Markdown to maintain.
//
// Flow:
//   1. Spin up `npx serve out -p 4322` against the static export.
//   2. Wait for the port to accept connections.
//   3. Run system Chrome in headless mode against
//      http://localhost:4322/manual/ and write the PDF to
//      `public/linkpower-companion-manual.pdf`.
//   4. Tear the static server down.
//
// Run: `pnpm pdf` (after `pnpm build`).

import { spawn, execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import net from "node:net";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const exec = promisify(execFile);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "out");
const PDF_OUT = path.join(ROOT, "public", "linkpower-companion-manual.pdf");

// macOS-bundled Chrome path. If the user is on Linux/Windows we'd
// fall back to `chromium`/`google-chrome` on PATH, but for now we
// only need to support the local dev environment.
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const PORT = 4322;
const URL = `http://localhost:${PORT}/manual/`;

async function waitForPort(port, timeoutMs = 10_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const ok = await new Promise((resolve) => {
      const sock = new net.Socket();
      sock.setTimeout(500);
      sock.once("connect", () => { sock.destroy(); resolve(true); });
      sock.once("error", () => { sock.destroy(); resolve(false); });
      sock.once("timeout", () => { sock.destroy(); resolve(false); });
      sock.connect(port, "127.0.0.1");
    });
    if (ok) return;
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`Port ${port} never opened`);
}

async function main() {
  // Sanity: the static export must already exist.
  try {
    await fs.access(path.join(OUT_DIR, "manual", "index.html"));
  } catch {
    console.error("✗ /manual/ not found in `out/`. Run `pnpm build` first.");
    process.exit(1);
  }

  console.log(`▶  Starting static server on :${PORT}`);
  const server = spawn(
    "npx",
    ["--yes", "serve", OUT_DIR, "-p", String(PORT), "-L", "--no-clipboard"],
    { stdio: ["ignore", "ignore", "inherit"], detached: true },
  );

  try {
    await waitForPort(PORT);
    console.log(`▶  Rendering ${URL} → ${path.relative(ROOT, PDF_OUT)}`);

    await exec(CHROME, [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--hide-scrollbars",
      "--no-pdf-header-footer",
      `--print-to-pdf=${PDF_OUT}`,
      "--print-to-pdf-no-header",
      // Wait for fonts + images. Headless Chrome's default timeout is
      // generous and we have minimal JS — should complete in <2s.
      "--virtual-time-budget=10000",
      URL,
    ]);

    const stat = await fs.stat(PDF_OUT);
    console.log(`✓  Wrote ${path.relative(ROOT, PDF_OUT)} (${(stat.size / 1024).toFixed(1)} KB)`);
  } finally {
    // Best-effort kill of the detached server group.
    try {
      process.kill(-server.pid);
    } catch { /* noop */ }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
