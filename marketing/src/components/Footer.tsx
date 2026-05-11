// Footer extracted from `src/app/page.tsx`. Reused on every blog page
// for consistency.
import { GITHUB_URL, THEME } from "./theme";

export function Footer() {
  return (
    <footer
      style={{
        background: "#fff",
        borderTop: `1px solid ${THEME.hairline}`,
        padding: "40px 24px 56px",
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <div style={{ maxWidth: 480 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                overflow: "hidden",
                display: "inline-block",
                background: "#fff",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/app-icon-fg.png"
                alt=""
                width={28}
                height={28}
                style={{ display: "block" }}
              />
            </span>
            <span
              style={{ fontWeight: 800, color: THEME.ink, fontSize: 14 }}
            >
              Link-Power Companion
            </span>
          </div>
          <p
            style={{
              fontSize: 12,
              color: THEME.muted,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Unofficial. Not affiliated with, endorsed by, or supported by
            PeakDo Tech, Inc. Link-Power and PeakDo are trademarks of their
            respective owners. Use at your own risk.
            <br />
            <span style={{ color: THEME.subtle }}>
              MIT licensed · iOS 17+
            </span>
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: 28,
            fontSize: 13,
            fontWeight: 600,
            flexWrap: "wrap",
          }}
        >
          <a href="/#features" style={{ color: THEME.inkSoft, textDecoration: "none" }}>
            Features
          </a>
          <a href="/#devices" style={{ color: THEME.inkSoft, textDecoration: "none" }}>
            Devices
          </a>
          <a href="/blog/" style={{ color: THEME.inkSoft, textDecoration: "none" }}>
            Blog
          </a>
          <a href="/#faq" style={{ color: THEME.inkSoft, textDecoration: "none" }}>
            FAQ
          </a>
          <a href="/manual/" style={{ color: THEME.inkSoft, textDecoration: "none" }}>
            User Manual
          </a>
          <a href="/linkpower-1-quick-start/" style={{ color: THEME.inkSoft, textDecoration: "none" }}>
            LP1 Quick Start
          </a>
          <a href="/linkpower-2-quick-start/" style={{ color: THEME.inkSoft, textDecoration: "none" }}>
            LP2 Quick Start
          </a>
          <a href={GITHUB_URL} style={{ color: THEME.inkSoft, textDecoration: "none" }}>
            GitHub
          </a>
          <a href="/support/" style={{ color: THEME.inkSoft, textDecoration: "none" }}>
            Support
          </a>
          <a href="/privacy/" style={{ color: THEME.inkSoft, textDecoration: "none" }}>
            Privacy
          </a>
          <a href="/terms/" style={{ color: THEME.inkSoft, textDecoration: "none" }}>
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
